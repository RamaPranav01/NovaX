from app.services.external.serper_client import serper_client 
from langchain_core.tools import tool
from typing import List
import asyncio

@tool
async def web_search(query: str) -> List[str]:
    """
    Performs a web search using the Serper API and returns a list of clean
    text snippets. This is the primary tool for gathering external evidence
    for the fact-checking agents.

    Args:
        query: The search query string.

    Returns:
        A list of strings, where each string is a snippet from a search result.
    """
    print(f"Performing web search for: '{query}'")
    if not serper_client:
        return []

    try:
        raw_results = await serper_client.search(query)

        if not raw_results:
            return []
        
        snippets = [
            result["snippet"]
            for result in raw_results
            if "snippet" in result
        ]
        
        return snippets[:5] 

    except Exception as e:
        print(f"An error occurred while processing search results: {e}")
        return []

