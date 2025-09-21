from app.core.config import settings

# This file acts as a "smart switch" for all services.
# It decides whether to export REAL or MOCK services based on an environment variable.

# --- Semantic Cache Service ---
if settings.USE_MOCK_SERVICES:
    from .mock_cache_manager import mock_cache_manager as cache_manager
else:
    # This will be enabled when you build the real cache_manager.py
    # from .cache_manager import cache_manager as cache_manager
    print("WARNING: Real CacheManager not yet implemented. Falling back to mock.")
    from .mock_cache_manager import mock_cache_manager as cache_manager


# --- NEW: Dynamic Threat Freezing Service ---
if settings.USE_MOCK_SERVICES:
    # We are building the mock version now.
    from .mock_threat_manager import mock_threat_manager as threat_manager
else:
    # In the future, you would build the real threat manager here.
    # For now, we fall back to the mock to prevent crashes.
    print("WARNING: Real ThreatManager not yet implemented. Falling back to mock.")
    from .mock_threat_manager import mock_threat_manager as threat_manager