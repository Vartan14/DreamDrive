"""Tests for the user API."""
from django.urls import reverse
from django.test import TestCase
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient
from rest_framework import status


CREATE_USER_URL = reverse('user:register')
ME_URL = reverse('user:me')
CHANGE_PASSWORD_URL = reverse('user:change_password')


def create_user(**params):
    """Create and return a new user."""
    return get_user_model().objects.create_user(**params)


class PublicUserApiTests(TestCase):
    """Test the public features of the user API."""

    def setUp(self):
        self.client = APIClient()

    def test_create_user_success(self):
        """Test creating a user is successful."""
        payload = {
            'email': 'test@example.com',
            'password': 'testpass',
            'first_name': 'Test',
            'last_name': 'User',
        }

        res = self.client.post(CREATE_USER_URL, payload)

        # Check request status  code  is 201 Created
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Check user was created and password is hashed
        user = get_user_model().objects.get(email=payload['email'])
        self.assertTrue(user.check_password(payload['password']))
        self.assertNotIn('password', res.data)

    def test_create_user_already_exists(self):
        """Test creating a user that already exists fails."""
        payload = {
            'email': 'test@example.com',
            'password': 'testpass',
            'first_name': 'Test',
            'last_name': 'User',
        }

        create_user(**payload)

        res = self.client.post(CREATE_USER_URL, payload)

        # Check request status code is 400 Bad Request
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_too_short(self):
        """Test the password must be more than 8 characters."""
        payload = {
            'email': 'test@example.com',
            'password': '1234',
            'first_name': 'Test',
            'last_name': 'User',
        }

        res = self.client.post(CREATE_USER_URL, payload)

        # Check request status code is 400 Bad Request
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        # Check user was not created
        user_exists = get_user_model().objects.filter(email=payload['email']).exists()
        self.assertFalse(user_exists)


class PrivateUserApiTests(TestCase):
    """Test API requests that require authentication."""
    def setUp(self):
        self.user = create_user(
            email='test@example.com',
            password='password',
            first_name='Test',
            last_name='User',
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_retrieve_profile_success(self):
        """Test retrieving profile for logged in user."""
        res = self.client.get(ME_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        })

    def test_post_me_not_allowed(self):
        """Test POST is not allowed on the 'me' URL."""
        res = self.client.post(ME_URL, {})

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_user_profile(self):
        """Test updating the user profile for authenticated user."""
        payload = {
            'first_name': 'NewName',
            'last_name': 'NewLastName',
            'password': 'newpassword',
        }

        res = self.client.patch(ME_URL, payload)

        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, payload['first_name'])
        self.assertEqual(self.user.last_name, payload['last_name'])
        self.assertTrue(self.user.check_password(payload['password']))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_update_email_not_allowed(self):
        """Test updating the email is not allowed."""
        payload = {
            "email": "newEmail@example.com"
        }

        res = self.client.patch(ME_URL, payload)

        self.user.refresh_from_db()
        self.assertNotEqual(self.user.email, payload['email'])
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    """
    Change password tests
    """
    def test_change_password_success(self):
        """Test changing password with valid data is successful."""
        payload = {
            'old_password': 'password',
            'new_password': 'newsecurepassword123',
        }

        res = self.client.patch(CHANGE_PASSWORD_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('detail', res.data)

        # Ensure new password works
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(payload['new_password']))

    def test_change_password_wrong_old_password(self):
        """Test changing password fails with wrong old password."""
        payload = {
            'old_password': 'wrongpassword',
            'new_password': 'newsecurepassword123',
        }

        res = self.client.patch(CHANGE_PASSWORD_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('old_password', res.data)

    def test_change_password_too_short(self):
        """Test changing password fails if new password is too short."""
        payload = {
            'old_password': 'password',
            'new_password': '123',
        }

        res = self.client.patch(CHANGE_PASSWORD_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', res.data)
