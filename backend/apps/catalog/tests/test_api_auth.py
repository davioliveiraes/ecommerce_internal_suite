from django.contrib.auth import get_user_model
from django.test import TestCase
from ninja.testing import TestClient

from config.api import api


class AuthAPITestCase(TestCase):
    def setUp(self):
        self.client = TestClient(api)
        self.user = get_user_model().objects.create_user(
            username="admin",
            password="senha-segura-123",
            email="admin@example.com",
        )

    def test_login_retorna_token(self):
        response = self.client.post(
            "/auth/login",
            json={"username": "admin", "password": "senha-segura-123"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["token"])
        self.assertEqual(data["token_type"], "Bearer")
        self.assertEqual(data["user"]["username"], "admin")

    def test_me_exige_token(self):
        response = self.client.get("/auth/me")
        self.assertEqual(response.status_code, 401)

    def test_rota_catalogo_exige_token(self):
        response = self.client.get("/catalog/produtos/")
        self.assertEqual(response.status_code, 401)
