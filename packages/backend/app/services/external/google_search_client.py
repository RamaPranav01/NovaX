import httpx
from typing import List, Dict, Any, Optional

from app.core.config import settings

class GoogleSearchClient:
    """
    An asynchronous client for the Google Custom Search JSON API.
    """
    def __init__(self):
        self.api_key = settings.GOOGLE_SEARCH_API_KEY
        self.cse_id = settings.GOOGLE_CSE_ID
        self.api_url = "https://www.googleapis.com/customsearch/v1"

    async def search(self, query: str) -> Optional[List[Dict[str, Any]]]:
        """
        Performs a web search using the Google Custom Search API.

        Args:
            query: The search query string.

        Returns:
            A list of search result items, or None if an error occurs.
        """
        if not all([self.api_key, self.cse_id]):
            print("Warning: Google Search API Key or CSE ID is not set. Web search is disabled.")
            return None

        params = {"key": self.api_key, "cx": self.cse_id, "q": query}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.api_url, params=params)
                response.raise_for_status()
                data = response.json()
                # We return the 'items' from the response, which is a list of results
                return data.get("items", [])
        except httpx.HTTPStatusError as e:
            print(f"Error calling Google Search API: {e.response.status_code} - {e.response.text}")
            return None
        except Exception as e:
            print(f"An unexpected error occurred during Google web search: {e}")
            return None

# Create a single, reusable instance of the client
google_search_client = GoogleSearchClient()