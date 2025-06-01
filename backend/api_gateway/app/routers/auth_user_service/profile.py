from fastapi import APIRouter, Request
import httpx
from fastapi.params import Depends

from config import settings
from utils.auth import get_user_info_from_jwt, prepare_forward_headers
from utils.http_client import proxy_request

router = APIRouter(tags=["Profiles"])


@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy_to_profiles(request: Request, path: str, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    query_params = request.url.query
    url = f"{settings.AUTH_SERVICE_URL}/api/v1/profile/{path}"
    if query_params:
        url = f"{url}?{query_params}"
    headers = prepare_forward_headers(request, user)

    return await proxy_request(
        method=request.method,
        url=url,
        headers=headers,
        body=body,
    )

