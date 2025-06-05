from fastapi import APIRouter, Request
from fastapi.params import Depends

from config import settings
from utils.auth import get_user_info_from_jwt, prepare_forward_headers
from utils.http_client import proxy_request

app_name = 'pdr'
router = APIRouter(prefix=f"/pdr", tags=["PDR"])


@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy_to_pdr(request: Request, path: str, user=Depends(get_user_info_from_jwt)):
    body = await request.body()

    url = f"{settings.LEARNING_SERVICE_URL}/api/v1/{app_name}/{path}"
    query_params = request.url.query
    if query_params:
        url = f"{url}?{query_params}"
    headers = prepare_forward_headers(request, user)

    return await proxy_request(
        method=request.method,
        url=url,
        headers=headers,
        body=body,
    )


