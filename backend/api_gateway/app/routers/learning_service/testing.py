from fastapi import APIRouter, Request
import httpx

from config import settings

router = APIRouter(prefix="/testing", tags=["Testing"])


@router.api_route("/start/", methods=["POST"])
async def start_ticket_test(request: Request):
    async with httpx.AsyncClient() as client:
        body = await request.body()
        headers = dict(request.headers)
        headers["host"] = "localhost"  # або інше допустиме значення
        resp = await client.post(
            url=f"{settings.LEARNING_SERVICE_URL}/api/v1/testing/start/",
            content=body,
            headers=headers)

        return resp.json()


@router.api_route("/submit/", methods=["POST"])
async def submit_ticket_test(request: Request):
    async with httpx.AsyncClient() as client:
        body = await request.body()
        headers = dict(request.headers)
        headers["host"] = "localhost"
        resp = await client.post(
            url=f"{settings.LEARNING_SERVICE_URL}/testing/submit/",
            content=body,
            headers=headers)

        return resp.json()
