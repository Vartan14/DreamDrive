import httpx
from fastapi import Request, HTTPException
from fastapi.params import Depends
from utils.auth import get_user_info_from_jwt, prepare_forward_headers


async def make_request(method: str, url: str, headers: dict, body: bytes):
    print("Making request to:", url)

    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                content=body
            )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")

    if response.status_code != 200:
        try:
            error_detail = response.json()
        except ValueError:
            error_detail = response.text
        raise HTTPException(status_code=response.status_code, detail=error_detail)

    return response.json()



async def proxy_request(method: str, url: str, headers: dict, body: bytes):
    print("Making request to:", url)

    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=method,
            url=url,
            headers=headers,
            content=body
        )

    if response.status_code not in [200, 201]:
        try:
            error_detail = response.json()
        except ValueError:
            error_detail = response.text
        raise HTTPException(status_code=response.status_code, detail=error_detail)

    try:
        return response.json()
    except ValueError:
        raise HTTPException(status_code=500, detail="Invalid JSON response from the server")