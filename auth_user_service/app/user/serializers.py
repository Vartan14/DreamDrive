"""
Serializers for User API views.
"""
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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


class AdminUserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""

    class Meta:
        model = get_user_model()
        fields = '__all__'

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


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom serializer to include additional data in JWT response."""

    @classmethod
    def get_token(cls, user):
        """Generate a token for the user with additional claims."""
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['role'] = user.role
        return token
