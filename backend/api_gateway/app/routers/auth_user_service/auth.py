from fastapi import APIRouter, Request
from fastapi.params import Depends

from utils.http_client import make_request
from utils.auth import get_user_info_from_jwt
from config import settings



router = APIRouter(tags=["Auth"])
request_prefix = "api/v1/auth"


@router.post("/registration")
async def register_user(request: Request):
    body = await request.body()
    url = f"{settings.AUTH_SERVICE_URL}/{request_prefix}/registration/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("POST", url, headers, body)


@router.post("/login")
async def login_user(request: Request):
    body = await request.body()
    url = f"{settings.AUTH_SERVICE_URL}/{request_prefix}/login/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("POST", url, headers, body)


@router.post("/logout")
async def logout_user(request: Request):
    body = await request.body()
    url = f"{settings.AUTH_SERVICE_URL}/{request_prefix}/logout/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("POST", url, headers, body)


@router.post("/token/refresh")
async def refresh_token(request: Request):
    body = await request.body()
    url = f"{settings.AUTH_SERVICE_URL}/{request_prefix}/token/refresh/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("POST", url, headers, body)


@router.post("/token/verify")
async def verify_token(request: Request):
    body = await request.body()
    url = f"{settings.AUTH_SERVICE_URL}/{request_prefix}/token/verify/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("POST", url, headers, body)


@router.post("/password/reset")
async def password_reset(request: Request):
    body = await request.body()
    url = f"{settings.AUTH_SERVICE_URL}/{request_prefix}/password/reset/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("POST", url, headers, body)

@router.post("/password/reset/confirm")
async def password_reset_confirm(request: Request):
    body = await request.body()
    url = f"{settings.AUTH_SERVICE_URL}/api/v1/auth/password/reset/confirm/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("POST", url, headers, body)


@router.post("/password/change")
async def password_change(request: Request, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    url = f"{settings.AUTH_SERVICE_URL}/{request_prefix}/password/change/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("POST", url, headers, body)