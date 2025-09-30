# PURPOSE:
# This file is the master orchestrator for the Nova API. It integrates all the
# AI agents built by Developer 2 (the AI Logic Architect) into a cohesive,
# end-to-end pipeline.


import asyncio
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from sqlalchemy.orm import Session
from . import deps
# from app.schemas.user import User
from app.crud import crud_log
from app.models import log as log_models

from app.services.ai_critics import (
    check_prompt_injection,
    check_custom_policy,
    extract_verifiable_claim,
    verify_claim_with_sources,
    check_for_hallucinations,
    SecurityCriticResponse,
    PolicyCriticResponse,
    ClaimExtractorResponse,
    VerificationResponse,
    HallucinationVerdict
)
from app.services.tools import web_search
from app.services.ai_critics import model as primary_llm


class GatewayRequest(BaseModel):
    prompt: str = Field(..., example="What is the latest report on NVDA stock?")
    policy: str = Field(default="Default policy: Be helpful and harmless.", example="Do not give financial advice.")

class RumorVerifierResult(BaseModel):
    """Stores the result of the full Claim -> Search -> Verify pipeline."""
    verdict: str = Field(..., description="The final verdict from the Synthesizing Verifier (e.g., SUPPORTED, CONTRADICTED).")
    claim: str = Field(..., description="The specific claim that was investigated.")
    reasoning: str = Field(..., description="The reasoning provided by the verifier agent.")
    sources_consulted: List[str] = Field(default_factory=list, description="The list of source snippets used for verification.")

class GatewayResponse(BaseModel):
    """The unified response model, including all V1 and V2 checks."""
    llm_response: str
    inbound_check: SecurityCriticResponse
    outbound_check: PolicyCriticResponse
    hallucination_check: HallucinationVerdict
    rumor_verifier: Optional[RumorVerifierResult] = None

class UnprotectedResponse(BaseModel):
    llm_response: str

# --- API Router ---
router = APIRouter()

@router.post("/unprotected-chat", response_model=UnprotectedResponse, tags=["Gateway V2"])
async def unprotected_chat(
    request: GatewayRequest,
):
    """
    An unprotected endpoint that directly calls the primary LLM without any security checks.
    """
    if not primary_llm:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Primary Language Model client not configured.")

    try:
        llm_response = await primary_llm.ainvoke(request.prompt)
        llm_text_response = llm_response.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling primary LLM: {e}")

    return UnprotectedResponse(llm_response=llm_text_response)

@router.post("/nova-chat", response_model=GatewayResponse, tags=["Gateway V2"])
async def nova_chat(
    request: GatewayRequest,
    db: Session = Depends(deps.get_db)
    # current_user: User = Depends(deps.get_current_user)
):
    """
    The main V2 endpoint for the Nova gateway.
    This is the master orchestration pipeline:
    1. V1 Inbound Security Check (Prompt Injection)
    2. Core LLM Call
    3. V2 Parallel Critics (Claim Extraction & Hallucination Check)
    4. V2 Web Search & Verification (if a claim is found)
    5. V1 Outbound Policy Check
    6. V2 Immutable Logging of all results
    """
    if not primary_llm:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Primary Language Model client not configured.")

    # --- 1. Inbound Check: Prompt Injection ---
    security_check = await check_prompt_injection(request.prompt)
    if security_check.verdict == "MALICIOUS":
        log_entry = log_models.LogCreate(
            request_data={"prompt": request.prompt, "policy": request.policy},
            response_data={"detail": f"Prompt rejected. Reason: {security_check.reasoning}"},
            verdict="BLOCKED"
        )
        crud_log.create_log(db=db, log_in=log_entry)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Prompt rejected. Reason: {security_check.reasoning}"
        )

    try:
        llm_response = await primary_llm.ainvoke(request.prompt)
        llm_text_response = llm_response.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling primary LLM: {e}")

    # --- 3. Parallel Critics: Run Claim Extractor & Hallucination Check concurrently ---
    claim_extraction_task = extract_verifiable_claim(llm_text_response)
    hallucination_check_task = check_for_hallucinations(llm_text_response)

    claim_response, hallucination_verdict = await asyncio.gather(
        claim_extraction_task,
        hallucination_check_task
    )

    # --- 4. Web Search & Verification Flow (The "Chain of Investigation") ---
    rumor_verifier_data = None
    if claim_response and claim_response.claim:
        claim_text = claim_response.claim
        source_snippets = await web_search(claim_text)
        
        if source_snippets:
            # Call the real Synthesizing Verifier agent
            verification_result = await verify_claim_with_sources(
                claim=claim_text, 
                sources=source_snippets
            )
            
            # Populate our response model with the verified, structured data
            rumor_verifier_data = RumorVerifierResult(
                verdict=verification_result.verdict,
                claim=claim_text,
                reasoning=verification_result.reasoning,
                sources_consulted=source_snippets
            )

    # --- 5. Outbound Check: Custom Policy ---
    policy_check = await check_custom_policy(text_to_check=llm_text_response, policy=request.policy)
    final_response_text = llm_text_response
    if policy_check.verdict == "FAIL":
        final_response_text = f"[POLICY WARNING: {policy_check.reasoning}] {llm_text_response}"

    # --- 6. Final Immutable Logging ---
    log_entry = log_models.LogCreate(
        request_data={"prompt": request.prompt, "policy": request.policy},
        response_data={
            "llm_response": final_response_text,
            "inbound_check": security_check.model_dump(),
            "outbound_check": policy_check.model_dump(),
            "hallucination_check": hallucination_verdict.model_dump(),
            "rumor_verifier": rumor_verifier_data.model_dump() if rumor_verifier_data else None,
        },
        verdict="ALLOWED"
    )
    crud_log.create_log(db=db, log_in=log_entry)

    # --- 7. Send Final Enriched Response ---
    return GatewayResponse(
        llm_response=final_response_text,
        inbound_check=security_check,
        outbound_check=policy_check,
        hallucination_check=hallucination_verdict,
        rumor_verifier=rumor_verifier_data
    )