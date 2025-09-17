import asyncio
import os
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
# 1. V1 & V2 Components: Security, Auth, Logging, and Dependencies
import openai
from . import deps  # Use relative import for the local deps file
from app.schemas.user import User # Import the SQLAlchemy User model, which deps provides
from app.services.ai_critics import check_prompt_injection, check_custom_policy, SecurityCritic_Response, PolicyCritic_Response
from app.crud import crud_log
from app.models import log as log_models

# 2. V2 Components: The new external search client
from app.services.external.serper_client import serper_client

# --- OpenAI Client Initialization ---
try:
    client = openai.AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
except TypeError:
    client = None

# --- (MOCKED) AI Logic Functions from Dev 2 (AI Specialist) ---
# In a real sprint, these would be imported from a separate services file.
async def extract_verifiable_claim(text: str) -> Optional[str]:
    """(Placeholder) Simulates AI logic from Dev 2 to find a factual claim in text."""
    print(f"MOCK: Extracting verifiable claim from text...")
    await asyncio.sleep(0.2)
    if "fastest growth in semiconductor history" in text:
        return "NVIDIA's revenue growth is the fastest in semiconductor history"
    return None

async def verify_claim_with_sources(claim: str, sources: List[Dict[str, Any]]) -> Dict[str, Any]:
    """(Placeholder) Simulates AI logic from Dev 2 to verify a claim against search results."""
    print(f"MOCK: Verifying claim '{claim}' with {len(sources)} sources...")
    await asyncio.sleep(0.3)
    return {
        "status": "Likely True",
        "reasoning": "Multiple reputable financial news outlets corroborate the rapid growth, although the 'fastest ever' claim is difficult to verify definitively.",
        "supporting_sources": [src.get('link') for src in sources[:2] if src.get('link')]
    }

# --- V2 Pydantic Models: Upgraded for the new feature ---

class GatewayRequest(BaseModel):
    prompt: str = Field(..., example="What is the latest report on NVDA stock?")
    policy: str = Field(default="Default policy: Be helpful and harmless.", example="Do not give financial advice.")

class RumorVerifierResult(BaseModel):
    status: str
    claim: str
    reasoning: str
    supporting_sources: List[str] = Field(default_factory=list)

class GatewayResponse(BaseModel):
    """The unified response model, including both V1 and V2 checks."""
    llm_response: str
    inbound_check: SecurityCritic_Response
    outbound_check: PolicyCritic_Response
    rumor_verifier: Optional[RumorVerifierResult] = None

# --- API Router ---
router = APIRouter()

@router.post("/nova-chat", response_model=GatewayResponse, tags=["Gateway V2"])
async def nova_chat(
    request: GatewayRequest,
    db: Session = Depends(deps.get_db), # <-- FINAL FIX: Correctly gets the DB session from deps.py
    current_user: User = Depends(deps.get_current_user)
):
    """
    The main V2 endpoint for the Nova gateway, requiring authentication.
    This is the master orchestration pipeline:
    1. V1 Inbound Security Check (Prompt Injection)
    2. Core LLM Call
    3. V2 Rumor Verifier Flow (Extract Claim -> Search -> Verify)
    4. V1 Outbound Security Check (Custom Policy)
    5. V2 Immutable Logging
    """
    if not client:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="OpenAI client not configured.")

    # --- 1. V1 Inbound Check: Prompt Injection ---
    security_check = await check_prompt_injection(request.prompt)
    if security_check.verdict == "MALICIOUS":
        # Log the malicious attempt using our new immutable log CRUD function
        log_entry = log_models.LogCreate(
            request_data={"prompt": request.prompt, "policy": request.policy},
            response_data={"detail": f"Prompt rejected as potentially malicious. Reason: {security_check.reasoning}"},
            verdict="BLOCKED"
        )
        crud_log.create_log(db=db, log_in=log_entry)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Prompt rejected. Reason: {security_check.reasoning}"
        )

    # --- 2. Core AI Call ---
    try:
        main_llm_response = await client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": request.prompt}]
        )
        llm_text_response = main_llm_response.choices[0].message.content or "No response from model."
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling primary LLM: {e}")

    # --- 3. V2 Rumor Verifier Flow ---
    claim = await extract_verifiable_claim(llm_text_response)
    rumor_verifier_data = None
    if claim:
        print(f"Found claim: '{claim}'. Searching web for verification...")
        search_results = await serper_client.search(claim)
        if search_results:
            verification_result = await verify_claim_with_sources(claim, search_results)
            rumor_verifier_data = RumorVerifierResult(**verification_result, claim=claim)

    # --- 4. V1 Outbound Check: Custom Policy ---
    policy_check = await check_custom_policy(text_to_check=llm_text_response, policy=request.policy)
    final_response_text = llm_text_response
    if policy_check.verdict == "FAIL":
        final_response_text = f"[POLICY WARNING: {policy_check.reasoning}] {llm_text_response}"

    # --- 5. Final V2 Immutable Logging ---
    log_entry = log_models.LogCreate(
        request_data={"prompt": request.prompt, "policy": request.policy},
        response_data={
            "llm_response": final_response_text,
            "inbound_check": security_check.model_dump(),
            "outbound_check": policy_check.model_dump(),
            "rumor_verifier": rumor_verifier_data.model_dump() if rumor_verifier_data else None,
        },
        verdict="ALLOWED"
    )
    crud_log.create_log(db=db, log_in=log_entry)

    # --- 6. Send Final Enriched Response ---
    return GatewayResponse(
        llm_response=final_response_text,
        inbound_check=security_check,
        outbound_check=policy_check,
        rumor_verifier=rumor_verifier_data
    )