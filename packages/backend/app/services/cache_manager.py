from google.cloud import aiplatform
from typing import List, Optional

from app.core.config import settings

class CacheManager:
    """
    A service class to manage interactions with the Vertex AI Vector Search index
    for the semantic cache. This class encapsulates all SDK logic.
    """
    def __init__(self):
        
        if not all([settings.GCP_PROJECT_ID, settings.GCP_REGION, settings.VECTOR_SEARCH_ENDPOINT_ID]):
            print("ERROR: GCP settings for Vector Search are not fully configured. Real CacheManager is disabled.")
            self.index_endpoint = None
            return

        aiplatform.init(project=settings.GCP_PROJECT_ID, location=settings.GCP_REGION)

        
        self.index_endpoint = aiplatform.MatchingEngineIndexEndpoint(
            index_endpoint_name=settings.VECTOR_SEARCH_ENDPOINT_ID
        )
        self.deployed_index_id = settings.VECTOR_SEARCH_DEPLOYED_INDEX_ID
        print("CacheManager: Successfully connected to REAL Vertex AI Vector Search Endpoint.")

    async def check_cache(self, embedding: List[float], similarity_threshold: float = 0.9) -> Optional[str]:
        """
        Performs a nearest-neighbor search to find a semantically similar entry in the cache.
        """
        if not self.index_endpoint:
            return None
        try:
            search_results = self.index_endpoint.find_neighbors(
                queries=[embedding],
                deployed_index_id=self.deployed_index_id,
                num_neighbors=1,
            )
            if search_results and search_results[0]:
                best_match = search_results[0][0]
                if best_match.distance >= similarity_threshold:
                    print(f"REAL Cache HIT. Found similar entry '{best_match.id}' with score {best_match.distance:.4f}")
                    return best_match.id
            print("REAL Cache MISS.")
            return None
        except Exception as e:
            print(f"Error during REAL cache check: {e}")
            return None

    async def add_to_cache(self, entry_id: str, embedding: List[float]):
        """
        Adds a new prompt and its response embedding to the cache.
        """
        if not self.index_endpoint:
            return
        datapoint = {"id": entry_id, "embedding": embedding}
        try:
            self.index_endpoint.upsert_datapoints(
                datapoints=[datapoint],
                deployed_index_id=self.deployed_index_id
            )
            print(f"REAL Cache ADD. Added entry '{entry_id}' to the cache.")
        except Exception as e:
            print(f"Error during REAL cache add: {e}")

cache_manager = CacheManager()