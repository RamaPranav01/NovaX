from typing import List, Optional
import numpy as np

class MockCacheManager:
    """
    A STATEFUL mock version of the CacheManager for local development.
    This class has the exact same methods as the real CacheManager, but it
    now uses a simple dictionary to simulate a real cache.
    """
    def __init__(self):
      
        self._cache = {} # Stores entry_id -> embedding
        
        print("="*80)
        print("WARNING: Using STATEFUL MOCK CacheManager. This is for local dev only.")
        print("="*80)

    async def check_cache(self, embedding: List[float], similarity_threshold: float = 0.9) -> Optional[str]:
        """
        (Mock) Simulates checking the cache. It now iterates through its
        in-memory store and performs a simple similarity check.
        """
        if not self._cache:
            print("MOCK CacheManager: Cache is empty. Returning MISS.")
            return None

        query_vector = np.array(embedding)
        
        best_match_id = None
        highest_similarity = -1.0

        for entry_id, stored_embedding_list in self._cache.items():
            stored_vector = np.array(stored_embedding_list)
            
            similarity = np.dot(query_vector, stored_vector)
            
            if similarity > highest_similarity:
                highest_similarity = similarity
                best_match_id = entry_id

        if highest_similarity >= similarity_threshold:
            print(f"MOCK Cache HIT. Found similar entry '{best_match_id}' with score {highest_similarity:.4f}")
            return best_match_id
        
        print(f"MOCK Cache MISS. Best match score was {highest_similarity:.4f} (below threshold of {similarity_threshold})")
        return None

    async def add_to_cache(self, entry_id: str, embedding: List[float]):
        """
        (Mock) Simulates adding to the cache. It now stores the entry in its
        in-memory dictionary.
        """
        print(f"MOCK Cache ADD. Added entry '{entry_id}' to the cache.")
        self._cache[entry_id] = embedding


mock_cache_manager = MockCacheManager()