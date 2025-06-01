from urllib.parse import urlencode

from fastapi import APIRouter, Request
from fastapi.params import Depends
from utils.http_client import proxy_request, make_request
from config import settings
from utils.auth import get_user_info_from_jwt, prepare_forward_headers

router = APIRouter(prefix="/teacher", tags=["Schedule \ Teacher"])
request_prefix = "api/v1/schedule/teacher"


@router.api_route("/theory-lessons/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy_to_teacher_theory_lessons(request: Request, path: str, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    url = f"{settings.SCHEDULE_SERVICE_URL}/{request_prefix}/theory-lessons/{path}"
    headers = prepare_forward_headers(request, user)

    return await proxy_request(
        method=request.method,
        url=url,
        headers=headers,
        body=body,
    )


@router.api_route("/practical-lessons/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy_to_teacher_practical_lessons(request: Request, path: str, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    url = f"{settings.SCHEDULE_SERVICE_URL}/{request_prefix}/practice-lessons/{path}"
    headers = prepare_forward_headers(request, user)

    return await proxy_request(
        method=request.method,
        url=url,
        headers=headers,
        body=body,
    )


@router.get("/calendar")
async def get_teacher_calendar(request: Request, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    query_params = urlencode(request.query_params)
    url = f"{settings.SCHEDULE_SERVICE_URL}/{request_prefix}/calendar/"
    if query_params:
        url = f"{url}?{query_params}"
    headers = prepare_forward_headers(request, user)

    return await make_request("GET", url, headers, body)


@router.get("/lesson-timeline")
async def get_teacher_timeline(request: Request, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    query_params = urlencode(request.query_params)
    url = f"{settings.SCHEDULE_SERVICE_URL}/{request_prefix}/lesson-timeline/"
    if query_params:
        url = f"{url}?{query_params}"
    headers = prepare_forward_headers(request, user)

    return await make_request("GET", url, headers, body)

