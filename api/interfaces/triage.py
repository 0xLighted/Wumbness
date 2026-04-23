from typing import Any

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter(tags=["triage"],)

class TriageRequest(BaseModel):
	patient_id: str | None = None
	messages: list[dict[str, Any]] = Field(default_factory=list)


@router.post("/triage")
def triage(_: TriageRequest) -> dict[str, object]:
	raise HTTPException(
		status_code=status.HTTP_501_NOT_IMPLEMENTED,
		detail="Triage API scaffold is initialized. Business logic is not implemented yet.",
	)