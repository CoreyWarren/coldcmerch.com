from rest_framework import permissions
from .models import BlacklistedToken

class NotBlacklisted(permissions.BasePermission):
    message = 'Provided token has been blacklisted.'

    def has_permission(self, request, view):
        token = request.COOKIES.get('refresh')
        if token and BlacklistedToken.objects.filter(token=token).exists():
            return False
        return True
