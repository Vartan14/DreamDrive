"""
URLs for the application
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from drf_spectacular.utils import extend_schema, OpenApiParameter
from allauth.account.views import ConfirmEmailView
from dj_rest_auth.views import PasswordResetConfirmView
from dj_rest_auth import views as dj_rest_auth_views
from app import settings
from accounts.views import GoogleLogin, GoogleLoginCallback, LoginPage


urlpatterns = [
    path('admin/', admin.site.urls),
    path("login/", LoginPage.as_view(), name="login"),
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),

    # Auth Routes
    path('api/v1/auth/', include("dj_rest_auth.urls")),
    path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),

    # Password Reset Endpoints
    path('api/v1/auth/password/reset/', dj_rest_auth_views.PasswordResetView.as_view(), name='password_reset'),

    path('api/v1/auth/password/reset/confirm/<slug:uidb64>/<slug:token>/', dj_rest_auth_views.PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
    path('accounts/', include('allauth.urls')),

    path("api/v1/auth/google/", GoogleLogin.as_view(), name="google_login"),
    path("api/v1/auth/google/callback/",GoogleLoginCallback.as_view(), name="google_login_callback"),

    # App Routes
    path('api/v1/user/', include('user.urls')),
    path('api/v1/group/', include('group.urls')),
    path('api/v1/profile/', include('user_profile.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)