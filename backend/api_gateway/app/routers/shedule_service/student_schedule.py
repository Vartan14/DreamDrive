from urllib.parse import urlencode

from fastapi import APIRouter, Request
from fastapi.params import Depends
from utils.http_client import proxy_request, make_request
from config import settings
from utils.auth import get_user_info_from_jwt, prepare_forward_headers

router = APIRouter(prefix="/student", tags=["Schedule \ Student"])
request_prefix = "api/v1/schedule/student"


@router.api_route("/theory-lessons/{path:path}", methods=["GET"])
async def proxy_to_student_theory_lessons(request: Request, path: str, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    url = f"{settings.SCHEDULE_SERVICE_URL}/{request_prefix}/theory-lessons/{path}"
    headers = prepare_forward_headers(request, user)

    # Request to User Service
    headers['X-User-Group-Id'] = "2"


    return await proxy_request(
        method=request.method,
        url=url,
        headers=headers,
        body=body,
    )


@router.api_route("/practice-lessons/{path:path}", methods=["GET"])
async def proxy_to_student_practice_lessons(request: Request, path: str, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    url = f"{settings.SCHEDULE_SERVICE_URL}/{request_prefix}/practice-lessons/{path}"
    headers = prepare_forward_headers(request, user)

    return await proxy_request(
        method=request.method,
        url=url,
        headers=headers,
        body=body,
    )


@router.get("/available-practice-lessons")
async def get_available_practice_lessons(request: Request, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    url = f"{settings.SCHEDULE_SERVICE_URL}/{request_prefix}/available-practice-lessons/"
    headers = prepare_forward_headers(request, user)

    data =  await make_request("GET", url, headers, body)
    instructors = {}

    for lesson in data:
        instructor_id = lesson.get("instructor_id")

        if instructor_id not in instructors:
            inst_url = f"{settings.AUTH_SERVICE_URL}/api/v1/profile/teachers/{instructor_id}/"
            instructor_info = await make_request("GET", inst_url, headers, b"")
            # print(instructor_info)

            instructors[instructor_id] = instructor_info.get("name", "Unknown Instructor")

        lesson["instructor_name"] = instructors[instructor_id]

    return data



@router.patch("/book-practice-lesson/{slot_id:int}")
async def book_practice_lesson(request: Request, slot_id: int, user=Depends(get_user_info_from_jwt)):
    body = await request.body()
    url = f"{settings.SCHEDULE_SERVICE_URL}/{request_prefix}/book-practice-lesson/{slot_id}/"
    headers = prepare_forward_headers(request, user)

    return await make_request("PATCH", url, headers, body)