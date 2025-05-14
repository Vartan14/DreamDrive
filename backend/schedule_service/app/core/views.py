import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from types import SimpleNamespace


class CustomJWTAuthentication(BaseAuthentication):
    """
    Custom authentication that decodes the JWT and attaches user info
    from the token payload. Does not check or require a local User object.
    """

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        # Create temp request.user
        user = SimpleNamespace(
            id=payload.get('user_id'),
            group_id=payload.get('group_id'),
            email=payload.get('email'),
            role=payload.get('role'),
            is_authenticated=True
        )

        return user, payload
