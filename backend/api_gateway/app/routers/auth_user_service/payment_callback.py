from fastapi import APIRouter, Request, HTTPException
import httpx
from fastapi.params import Depends

from config import settings
from utils.auth import get_user_info_from_jwt, prepare_forward_headers
from utils.http_client import make_request


router = APIRouter(tags=["Payment Callback"])


@router.post("/")
async def update_payment_status(request: Request):
    body = await request.body()
    url = f"{settings.AUTH_SERVICE_URL}/api/v1/users/update-payment-status/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("POST", url, headers, body)