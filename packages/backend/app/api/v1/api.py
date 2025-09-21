from fastapi import APIRouter

from . import logs
from . import auth
from . import gateway
from . import analytics 

api_router = APIRouter()
api_router.include_router(gateway.router, tags=["Gateway V2"])
api_router.include_router(auth.router, tags=["Authentication"])
api_router.include_router(logs.router, prefix="/logs", tags=["Logs"])
api_router.include_router(analytics.router) 