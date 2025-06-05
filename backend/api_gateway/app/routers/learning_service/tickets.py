from fastapi import APIRouter, Request
import httpx
from fastapi.params import Depends

from config import settings
from utils.auth import get_user_info_from_jwt, prepare_forward_headers


app_name = 'tickets'
router = APIRouter(prefix=f"/tickets", tags=["Tickets"])


@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy_to_tickets(request: Request, path: str, user=Depends(get_user_info_from_jwt)):
    body = await request.body()

    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=f"{settings.LEARNING_SERVICE_URL}/api/v1/{app_name}/{path}",
            headers=prepare_forward_headers(request, user),
            content=body
        )

    return response.json()


