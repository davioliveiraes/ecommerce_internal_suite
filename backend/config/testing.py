from django.contrib.auth import get_user_model
from ninja.testing import TestClient

from config.api import api
from config.auth import create_auth_token


def create_authenticated_client(username="tester"):
    user_model = get_user_model()
    user = user_model.objects.create_user(
        username=username,
        password="teste-12345",
        email=f"{username}@example.com",
    )
    token = create_auth_token(user)
    return TestClient(api, headers={"Authorization": f"Bearer {token}"}), user
