import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('api')


class APILoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log all API requests with method, path, status code, and user info.
    """

    def process_request(self, request):
        if request.path.startswith('/api/'):
            content_type = request.META.get('CONTENT_TYPE', 'N/A')
            logger.debug(f"📥 Incoming Request: {request.method} {request.path} | Content-Type: {content_type}")
        return None

    def process_response(self, request, response):
        user = request.user.username if request.user and request.user.is_authenticated else 'Anonymous'
        status_code = response.status_code
        
        # Log API requests
        if request.path.startswith('/api/'):
            response_content_type = response.get('Content-Type', 'N/A')
            logger.info(
                f"{request.method} {request.path} | Status: {status_code} | Content-Type: {response_content_type} | User: {user}"
            )
            
            # Log error responses in detail
            if status_code >= 400:
                logger.warning(f"❌ Error Response Status {status_code}: {request.path}")
        
        return response
