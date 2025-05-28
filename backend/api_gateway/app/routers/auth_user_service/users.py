from fastapi import APIRouter, Request, HTTPException
import httpx
from fastapi.params import Depends

from config import settings
from utils.auth import get_user_info_from_jwt, prepare_forward_headers


app_name = 'users'
router = APIRouter(tags=["Users"])


@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy_to_users(request: Request, path: str, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    print(f"REQUEST WAS SENT: {settings.AUTH_SERVICE_URL}/api/v1/{app_name}/{path}")


    try:
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=request.method,
                url=f"{settings.AUTH_SERVICE_URL}/api/v1/{app_name}/{path}",
                headers=prepare_forward_headers(request, user),
                content=body
            )
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=str(e))


    if response.status_code != 200:
        try:
            error_detail = response.json()
        except ValueError:
            error_detail = response.text
        raise HTTPException(status_code=response.status_code, detail=error_detail)

    return response.json()


