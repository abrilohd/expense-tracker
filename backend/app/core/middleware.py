"""
Custom middleware for FastAPI application
Handles request logging, timing, and other cross-cutting concerns
"""
import time
import logging
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log all incoming requests and their processing time
    """
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request and log details
        """
        # Start timer
        start_time = time.time()
        
        # Log incoming request
        logger.info(f"→ {request.method} {request.url.path}")
        
        # Process request
        response = await call_next(request)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Log response
        logger.info(
            f"← {request.method} {request.url.path} "
            f"[{response.status_code}] {process_time:.3f}s"
        )
        
        # Add custom header with processing time
        response.headers["X-Process-Time"] = str(process_time)
        
        return response
