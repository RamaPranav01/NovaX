import httpx
from typing import List, Dict, Any, Optional

from app.core.config import settings

class SerperClient:
    """
    An asynchronous client for the Serper.dev Google Search API.

    This client is responsible for all communication with the external
    web search service. It handles making the API request, processing
    the response, and error handling.
    """
    def __init__(self):
        self.api_key = settings.SERPER_API_KEY
        self.api_url = "https://google.serper.dev/search"

    async def search(self, query: str) -> Optional[List[Dict[str, Any]]]:
        """
        Performs a web search using the Serper API.

        Args:
            query: The search query string.

        Returns:
            A list of search result dictionaries, or None if an error occurs
            or the API key is not configured.
        """
        if not self.api_key:
            print("Warning: SERPER_API_KEY is not set. Web search is disabled.")
            return None

        payload = {"q": query}
        headers = {
            'X-API-KEY': self.api_key,
            'Content-Type': 'application/json'
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.api_url, json=payload, headers=headers)
                response.raise_for_status()  # Raises an exception for 4XX/5XX responses
                data = response.json()
                return data.get("organic", [])
        except httpx.HTTPStatusError as e:
            print(f"Error calling Serper API: {e.response.status_code} - {e.response.text}")
            return None
        except Exception as e:
            print(f"An unexpected error occurred during web search: {e}")
            return None

# Other parts of the application will import this instance.
serper_client = SerperClient()

