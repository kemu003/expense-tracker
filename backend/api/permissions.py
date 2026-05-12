from rest_framework import permissions
from .demo import DEMO_USER_EMAIL


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to access it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsNotDemoUser(permissions.BasePermission):
    """
    Permission to prevent demo users from performing destructive operations.
    Demo users can read and create, but not delete or update data.
    """

    def has_permission(self, request, view):
        # Allow all safe methods (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Block demo users from POST (create), PUT (update), PATCH (partial update), DELETE
        if request.user and request.user.is_authenticated:
            is_demo = request.user.email == DEMO_USER_EMAIL
            if is_demo and request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
                return False
        
        return True

    def has_object_permission(self, request, view, obj):
        # Allow all safe methods
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Block demo users from modifications
        if request.user and request.user.is_authenticated:
            is_demo = request.user.email == DEMO_USER_EMAIL
            if is_demo:
                return False
        
        return True