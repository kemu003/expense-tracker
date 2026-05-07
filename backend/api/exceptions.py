from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger('api')

def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF that ensures unhandled exceptions
    (like database errors) always return a JSON response instead of an HTML page.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # If the exception is not handled by DRF (e.g., standard Python/Django exceptions),
    # the response will be None. We need to catch these to prevent 500 HTML pages.
    if response is None:
        logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
        return Response({
            'error': 'A server error occurred.',
            'detail': str(exc)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
