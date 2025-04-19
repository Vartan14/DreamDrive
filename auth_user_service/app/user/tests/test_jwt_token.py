from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import jwt
from django.conf import settings

User = get_user_model()

TOKEN_URL = '/api/user/token/'
REFRESH_URL = '/api/user/token/refresh/'

class JWTAuthTests(APITestCase):

    def setUp(self):
        # Використовуємо first_name та last_name замість name
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

    def test_token_obtain_pair_success(self):
        """Test that valid credentials return access and refresh tokens"""
        payload = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        res = self.client.post(TOKEN_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)

    def test_token_obtain_pair_invalid_credentials(self):
        """Test that invalid credentials return 401"""
        payload = {
            'email': 'test@example.com',
            'password': 'wrongpass'
        }
        res = self.client.post(TOKEN_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('access', res.data)
        self.assertNotIn('refresh', res.data)

    def test_refresh_token_success(self):
        """Test that we can refresh access token using valid refresh token"""
        refresh = RefreshToken.for_user(self.user)
        res = self.client.post(REFRESH_URL, {'refresh': str(refresh)})

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)

    def test_blacklisted_token_cannot_refresh(self):
        """Test that blacklisted refresh token cannot be reused (if enabled)"""
        refresh = RefreshToken.for_user(self.user)
        # Blacklist token
        refresh.blacklist()

        res = self.client.post(REFRESH_URL, {'refresh': str(refresh)})

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', res.data)
        self.assertEqual(res.data['code'], 'token_not_valid')

    def test_user_data_in_token(self):
        """Test that user data is correctly included in the JWT token"""
        # Get token
        payload = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        res = self.client.post(TOKEN_URL, payload)

        # Ensure that we receive the access token
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        access_token = res.data['access']

        # Decode the JWT token without verifying the signature (for testing purposes)
        decoded_token = jwt.decode(access_token,
                                   settings.SECRET_KEY,
                                   algorithms=["HS256"],
                                   options={"verify_exp": False})

        # Check if the user email and user_id are in the token payload
        self.assertEqual(decoded_token['email'], 'test@example.com')
        self.assertEqual(decoded_token['user_id'], self.user.id)
        self.assertEqual(decoded_token['first_name'], 'Test')
        self.assertEqual(decoded_token['last_name'], 'User')
