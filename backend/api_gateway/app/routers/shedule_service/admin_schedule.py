from fastapi import APIRouter, Request
from fastapi.params import Depends
from urllib.parse import urlencode

from utils.http_client import make_request
from utils.auth import get_user_info_from_jwt, prepare_forward_headers
from config import settings


router = APIRouter(prefix="/admin", tags=["Schedule \ Admin"])
request_prefix = "api/v1/schedule/admin"


@router.get("/calendar")
async def get_calendar(request: Request, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    query_params = urlencode(request.query_params)
    url = f"{settings.SCHEDULE_SERVICE_URL}/{request_prefix}/calendar/"
    if query_params:
        url = f"{url}?{query_params}"
    headers = prepare_forward_headers(request, user)

    return await make_request("GET", url, headers, body)