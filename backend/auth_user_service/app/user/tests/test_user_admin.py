from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()

ADMIN_USERS_URL = reverse('user:admin-users-list')


def get_detail_url(user_id):
    return reverse('user:admin-users-detail', args=[user_id])


class AdminUserApiTests(TestCase):
    """Test API requests for admin user management."""

    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass',
            first_name='Admin',
            last_name='User'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin_user)

    def test_admin_can_list_users(self):
        """Test admin can retrieve the list of users."""
        res = self.client.get(ADMIN_USERS_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(any(u['email'] == self.admin_user.email for u in res.data))

    def test_admin_can_create_user(self):
        """Test admin can create a new user."""
        payload = {
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'first_name': 'New',
            'last_name': 'User'
        }
        res = self.client.post(ADMIN_USERS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=payload['email']).exists())

    def test_create_user_with_existing_email_fails(self):
        """Test creating user with duplicate email fails."""
        payload = {
            'email': 'duplicate@example.com',
            'password': 'pass1234',
            'first_name': 'Dup',
            'last_name': 'User'
        }
        User.objects.create_user(**payload)

        res = self.client.post(ADMIN_USERS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', res.data)

    def test_create_user_with_missing_fields_fails(self):
        """Test creating user with missing required fields fails."""
        payload = {
            'email': '',
            'password': '',
        }
        res = self.client.post(ADMIN_USERS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', res.data)
        self.assertIn('password', res.data)

    def test_admin_can_update_user(self):
        """Test admin can update existing user."""
        user = User.objects.create_user(
            email='toedit@example.com',
            password='editpass',
            first_name='Edit',
            last_name='User'
        )
        url = get_detail_url(user.id)
        payload = {'first_name': 'Updated'}

        res = self.client.patch(url, payload)
        user.refresh_from_db()

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(user.first_name, payload['first_name'])

    def test_update_non_existing_user_fails(self):
        """Test updating non-existing user returns 404."""
        url = get_detail_url(9999)
        res = self.client.patch(url, {'first_name': 'Ghost'})

        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_can_delete_user(self):
        """Test admin can delete user."""
        user = User.objects.create_user(
            email='todelete@example.com',
            password='delete123',
            first_name='Delete',
            last_name='Me'
        )
        url = get_detail_url(user.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=user.id).exists())

    def test_delete_non_existing_user_fails(self):
        """Test deleting non-existing user returns 404."""
        url = get_detail_url(9999)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_non_admin_user_cannot_access(self):
        """Test non-admin user is forbidden from accessing admin endpoints."""
        user = User.objects.create_user(
            email='user@example.com',
            password='userpass'
        )
        self.client.force_authenticate(user=user)

        res = self.client.get(ADMIN_USERS_URL)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
