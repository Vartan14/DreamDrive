import base64
import hashlib
import json
from django.conf import settings


def generate_signature(data: dict) -> tuple[str, str]:
    json_data = json.dumps(data)
    encoded_data = base64.b64encode(json_data.encode()).decode()

    sign_string = settings.LIQPAY_PRIVATE_KEY + encoded_data + settings.LIQPAY_PRIVATE_KEY
    signature = base64.b64encode(hashlib.sha1(sign_string.encode()).digest()).decode()

    return encoded_data, signature
