from fastapi import APIRouter, Request
from fastapi.params import Depends

from utils.http_client import make_request
from utils.auth import get_user_info_from_jwt
from config import settings

router = APIRouter(tags=["Payments"])
request_prefix = "api/v1/"


@router.post("/create-payment")
async def create_payment(request: Request):
    body = await request.body()
    url = f"{settings.PAYMENT_SERVICE_URL}/api/v1/create-payment/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("POST", url, headers, body)


@router.post("/callback/")
async def payment_callback(request: Request):
    body = await request.body()
    url = f"{settings.PAYMENT_SERVICE_URL}/api/v1/callback/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("POST", url, headers, body)


@router.get("/status")
async def payment_status(request: Request):
    body = await request.body()
    url = f"{settings.PAYMENT_SERVICE_URL}/api/v1/status/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("GET", url, headers, body)


@router.get("/payment-history")
async def payment_status(request: Request):
    body = await request.body()
    url = f"{settings.PAYMENT_SERVICE_URL}/api/v1/payment-history/"
    headers = {key: value for key, value in request.headers.items() if key.lower() != "host"}
    headers["Host"] = "localhost"
    return await make_request("GET", url, headers, body)