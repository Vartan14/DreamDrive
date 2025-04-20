"""Test JWT authentication endpoints"""
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken


User = get_user_model()
TOKEN_URL = reverse('user:token_obtain_pair')
REFRESH_URL = reverse('user:token_refresh')
VERIFY_URL = reverse('user:token_verify')


class JWTAuthTests(APITestCase):
    """Test the JWT authentication endpoints"""
    def setUp(self):
        """Set up the test case with a user"""
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
        payload = {
            'email': 'test@example.com',
            'password': 'testpass123',
        }
        res = self.client.post(TOKEN_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        access_token_str = res.data['access']

        # Decode the token using SimpleJWT AccessToken
        access_token = AccessToken(access_token_str)

        self.assertEqual(access_token['user_id'], self.user.id)
        self.assertEqual(access_token['email'], 'test@example.com')
        self.assertEqual(access_token['role'], 'student')

    def test_verify_token_success(self):
        """Test verifying a valid token"""
        payload = {
            'email': 'test@example.com',
            'password': 'testpass123',
        }

        res_obtain_tokens = self.client.post(TOKEN_URL, payload)
        self.assertEqual(res_obtain_tokens.status_code, status.HTTP_200_OK)
        self.assertIn('access', res_obtain_tokens.data)
        self.assertIn('refresh', res_obtain_tokens.data)

        res_verify_access = self.client.post(VERIFY_URL, {
            'token': res_obtain_tokens.data['access']
        })
        res_verify_refresh = self.client.post(VERIFY_URL, {
            'token': res_obtain_tokens.data['refresh']
        })

        self.assertEqual(res_verify_access.status_code, status.HTTP_200_OK)
        self.assertEqual(res_verify_refresh.status_code, status.HTTP_200_OK)

    def test_verify_token_failure(self):
        """Test verifying an invalid token"""
        res = self.client.post(VERIFY_URL, {'token': 'invalid.token.here'})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
