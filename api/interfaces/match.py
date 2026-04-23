from typing import Any

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter(tags=["match"],)

class MatchRequest(BaseModel):
	patient_id: str
	triage: dict[str, Any] = Field(default_factory=dict)


@router.post("/match")
def match(_: MatchRequest) -> dict[str, object]:
	raise HTTPException(
		status_code=status.HTTP_501_NOT_IMPLEMENTED,
		detail="Match API scaffold is initialized. Business logic is not implemented yet.",
	)