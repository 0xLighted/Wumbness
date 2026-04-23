from datetime import UTC, datetime
import os

from fastapi import APIRouter, Response, status

router = APIRouter(tags=["health"],)


@router.get("/")
@router.get("/health")
def health(response: Response) -> dict[str, object]:
	required_env = [
		"NEXT_PUBLIC_SUPABASE_URL",
		"NEXT_PUBLIC_SUPABASE_ANON_KEY",
	]
	missing_env = [key for key in required_env if not os.getenv(key)]
	ok = len(missing_env) == 0

	if not ok:
		response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

	return {
		"ok": ok,
		"service": "wumbo-wellness-api",
		"timestamp": datetime.now(UTC).isoformat(),
		"checks": {
			"env": "ok" if ok else "missing",
		},
		"missing_env": missing_env,
	}