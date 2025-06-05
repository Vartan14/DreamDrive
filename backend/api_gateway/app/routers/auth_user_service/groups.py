from fastapi import APIRouter, Request
import httpx
from fastapi.params import Depends

from config import settings
from utils.auth import get_user_info_from_jwt, prepare_forward_headers
from utils.http_client import make_request, proxy_request

router = APIRouter(tags=["Groups"])


@router.api_route("/admin/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy_to_admin_groups(request: Request, path: str, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    query_params = request.url.query
    url = f"{settings.AUTH_SERVICE_URL}/api/v1/groups/admin/{path}"
    if query_params:
        url = f"{url}?{query_params}"
    headers = prepare_forward_headers(request, user)

    return await proxy_request(
        method=request.method,
        url=url,
        headers=headers,
        body=body,
    )

@router.get("/my")
async def get_my_groups(request: Request):
    body = await request.body()
    url = f"{settings.AUTH_SERVICE_URL}/api/v1/groups/my/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("GET", url, headers, body)
