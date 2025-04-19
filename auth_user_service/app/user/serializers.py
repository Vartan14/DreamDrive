"""
Serializers for User API views.
"""
from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import gettext as _

from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""

    class Meta:
        model = get_user_model()
        fields = ('email', 'password', 'first_name', 'last_name')

        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8},
        }

    def create(self, validated_data):
        """Create a new user with encrypted password and return it."""
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Update a user instance.
        Email is not updatable.
        If a password is provided, it will be hashed and updated.
        If no password is provided, the default update behavior is used.
        Returns the updated user instance.
        """
        if 'email' in validated_data and validated_data['email'] != instance.email:
            raise serializers.ValidationError({
                'email': 'Email address cannot be changed.'
            })
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user

class TokenSerializer(serializers.Serializer):
    """Serializer for user authentication tokens."""
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False,
    )

    def validate(self, attrs):
        """Validate the user credentials."""
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )

        if not user:
            msg = _('Unable to log in with provided credentials.')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs
