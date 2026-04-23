from fastapi import FastAPI, Response, status
from api.interfaces.health import router as health_router
from api.interfaces.triage import router as triage_router
from api.interfaces.match import router as match_router

app = FastAPI(title="Wumbo Wellness Health API")
app.include_router(health_router)
app.include_router(triage_router)
app.include_router(match_router)

