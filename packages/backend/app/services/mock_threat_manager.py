from typing import List

class MockThreatManager:
    """
    A mock version of the Dynamic Threat Freezing service for local development.
    This class has the same methods as the real ThreatManager would, but does nothing.
    """
    def __init__(self):
        print("="*80)
        print("WARNING: Using MOCK ThreatManager. No threats will be saved.")
        print("="*80)

    async def add_to_threat_db(self, embedding: List[float]):
        """
        (Mock) Simulates adding a malicious embedding to the threat database.
        """
        print(f"MOCK ThreatManager: add_to_threat_db called. A real service would save this embedding.")
        
        pass


mock_threat_manager = MockThreatManager()