"""
Tests for the Django Admin modifications.
"""
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model


class AdminSiteTests(TestCase):
    """Tests for Django Admin."""

    def setUp(self):
        """Create user and client"""
        self.client = Client()
        self.admin_user = get_user_model().objects.create_superuser(
            email='admin@example.com',
            password='<PASSWORD>'
        )
        self.client.force_login(self.admin_user)

        self.user = get_user_model().objects.create_user(
            email='user@example.com',
            password='<PASSWORD>',
            first_name='Test First Name',
            last_name='Test Last Name'
        )

    def test_users_listed(self):
        """Test that users are listed on page"""
        url = reverse('admin:core_user_changelist')
        res = self.client.get(url)

        self.assertContains(res, self.user.first_name)
        self.assertContains(res, self.user.last_name)
        self.assertContains(res, self.user.email)
        self.assertContains(res, self.user.get_role_display())

    def test_edit_user_page(self):
        """Test the edit user page"""
        url = reverse('admin:core_user_change', args=[self.user.id])
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)

    def test_role_field_displayed_on_edit_page(self):
        """Test that role field is displayed on the user edit page"""
        url = reverse('admin:core_user_change', args=[self.user.id])
        res = self.client.get(url)

        self.assertContains(res, 'name="role"')


    def test_create_user_page(self):
        """Test the create user page"""
        url = reverse('admin:core_user_add')
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)



