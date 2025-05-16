from fastapi import Request, HTTPException, Depends
from jose import jwt, JWTError
from starlette.status import HTTP_401_UNAUTHORIZED
from config import settings


SECRET_KEY =  settings.SECRET_KEY
ALGORITHM = "HS256"


def get_user_info_from_jwt(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Token is missing")

    token = auth_header[len("Bearer "):]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token")


def prepare_forward_headers(request, user):
    headers = {
        key: value for key, value in request.headers.items()
        if key.lower() != "host"
    }
    headers["X-User-Id"] = str(user["user_id"])
    headers["X-User-Role"] = user["role"]
    headers["X-User-Email"] = user["email"]
    headers["Host"] = "localhost"
    return headers
