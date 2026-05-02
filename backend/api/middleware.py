import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('api')


class APILoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log all API requests with method, path, status code, and user info.
    """

    def process_response(self, request, response):
        user = request.user.username if request.user and request.user.is_authenticated else 'Anonymous'
        status_code = response.status_code
        
        # Log API requests
        if request.path.startswith('/api/'):
            logger.info(
                f"{request.method} {request.path} | Status: {status_code} | User: {user}"
            )
        
        return response
