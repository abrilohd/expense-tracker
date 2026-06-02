"""
Email service using Resend API or Gmail SMTP
Handles sending password reset emails and other notifications
"""
import os
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

# Try to import resend, but handle if not configured
try:
    import resend
    RESEND_AVAILABLE = True
    resend.api_key = os.getenv("RESEND_API_KEY", "")
except ImportError:
    RESEND_AVAILABLE = False
    logger.warning("Resend package not available")

class EmailService:
    """
    Email service for sending transactional emails
    Supports both Resend API and Gmail SMTP
    """
    
    @staticmethod
    def get_email_service() -> str:
        """Get configured email service (resend or smtp)"""
        return os.getenv("EMAIL_SERVICE", "resend").lower()
    
    @staticmethod
    def is_configured() -> bool:
        """Check if email service is properly configured"""
        service = EmailService.get_email_service()
        
        if service == "smtp":
            # Check SMTP configuration
            smtp_host = os.getenv("SMTP_HOST", "")
            smtp_user = os.getenv("SMTP_USER", "")
            smtp_password = os.getenv("SMTP_PASSWORD", "")
            return smtp_host and smtp_user and smtp_password
        else:
            # Check Resend configuration
            api_key = os.getenv("RESEND_API_KEY", "")
            return RESEND_AVAILABLE and api_key and api_key != ""
    
    @staticmethod
    def send_via_smtp(to_email: str, subject: str, html_content: str, text_content: str) -> Dict[str, Any]:
        """Send email via Gmail SMTP"""
        try:
            smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
            smtp_user = os.getenv("SMTP_USER", "")
            smtp_password = os.getenv("SMTP_PASSWORD", "")
            from_email = os.getenv("SMTP_FROM_EMAIL", smtp_user)
            
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = from_email
            message["To"] = to_email
            
            # Add text and HTML parts
            part1 = MIMEText(text_content, "plain")
            part2 = MIMEText(html_content, "html")
            message.attach(part1)
            message.attach(part2)
            
            # Send email
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(from_email, to_email, message.as_string())
            
            return {
                "success": True,
                "message": "Email sent successfully via SMTP",
                "email_id": "smtp_" + to_email
            }
            
        except Exception as e:
            logger.error(f"SMTP error: {str(e)}")
            return {
                "success": False,
                "message": "Failed to send email via SMTP",
                "error": str(e)
            }
    
    @staticmethod
    def send_via_resend(to_email: str, subject: str, html_content: str, text_content: str, from_email: str) -> Dict[str, Any]:
        """Send email via Resend API"""
        try:
            response = resend.Emails.send({
                "from": from_email,
                "to": to_email,
                "subject": subject,
                "html": html_content,
                "text": text_content
            })
            
            return {
                "success": True,
                "message": "Password reset email sent successfully",
                "email_id": response.get("id")
            }
            
        except Exception as e:
            logger.error(f"Resend error: {str(e)}")
            return {
                "success": False,
                "message": "Failed to send email",
                "error": str(e)  # Include actual error for debugging
            }
    
    @staticmethod
    def send_password_reset_email(
        to_email: str,
        reset_token: str,
        user_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send password reset email with reset link
        
        Args:
            to_email: Recipient email address
            reset_token: Password reset token
            user_name: Optional user name for personalization
            
        Returns:
            dict: Response with success status and message/error
        """
        # Check if email service is configured
        if not EmailService.is_configured():
            logger.warning(f"Email service not configured. Reset token for {to_email}: {reset_token}")
            return {
                "success": False,
                "error": "Email service not configured",
                "reset_token": reset_token,  # Include token for development/testing
                "message": "Email service is not configured. In production, configure RESEND_API_KEY."
            }
        
        # Get configuration from environment
        from_email = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")
        app_name = os.getenv("APP_NAME", "ExpenseTracker")
        app_url = os.getenv("APP_URL", "http://localhost:5173")
        
        # Build reset URL
        reset_url = f"{app_url}/reset-password?token={reset_token}"
        
        # Personalize greeting
        greeting = f"Hi {user_name}," if user_name else "Hi there,"
        
        # Email HTML content
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #00F5C4 0%, #7B61FF 50%, #FF6B9D 100%); padding: 40px 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                🔐 {app_name}
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                                Reset Your Password
                            </h2>
                            
                            <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                                {greeting}
                            </p>
                            
                            <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password for your {app_name} account. Click the button below to create a new password:
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 10px 0 30px;">
                                        <a href="{reset_url}" style="display: inline-block; background: linear-gradient(135deg, #00F5C4 0%, #7B61FF 50%, #FF6B9D 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(0, 245, 196, 0.3);">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                                Or copy and paste this link into your browser:
                            </p>
                            
                            <p style="margin: 0 0 30px; padding: 12px; background-color: #f8f8f8; border-radius: 6px; color: #666; font-size: 13px; word-break: break-all; font-family: monospace;">
                                {reset_url}
                            </p>
                            
                            <div style="border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 30px;">
                                <p style="margin: 0 0 10px; color: #666; font-size: 14px; line-height: 1.6;">
                                    <strong>⏰ This link will expire in 1 hour</strong>
                                </p>
                                
                                <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                                    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                            <p style="margin: 0 0 10px; color: #999; font-size: 13px;">
                                This email was sent by {app_name}
                            </p>
                            <p style="margin: 0; color: #999; font-size: 13px;">
                                © 2026 {app_name}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        """
        
        # Plain text version
        text_content = f"""
{greeting}

We received a request to reset your password for your {app_name} account.

Click the link below to create a new password:
{reset_url}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

---
This email was sent by {app_name}
© 2026 {app_name}. All rights reserved.
        """
        
        try:
            # Send email using configured service
            service = EmailService.get_email_service()
            
            if service == "smtp":
                # Send via Gmail SMTP
                return EmailService.send_via_smtp(
                    to_email=to_email,
                    subject=f"Reset Your {app_name} Password",
                    html_content=html_content,
                    text_content=text_content
                )
            else:
                # Send via Resend API
                return EmailService.send_via_resend(
                    to_email=to_email,
                    subject=f"Reset Your {app_name} Password",
                    html_content=html_content,
                    text_content=text_content,
                    from_email=from_email
                )
            
        except Exception as e:
            logger.error(f"Email error: {str(e)}")
            return {
                "success": False,
                "message": "Failed to send email",
                "error": str(e)  # Include actual error for debugging
            }
    
    @staticmethod
    def send_welcome_email(
        to_email: str,
        user_name: Optional[str] = None
    ) -> dict:
        """
        Send welcome email to new users
        
        Args:
            to_email: Recipient email address
            user_name: Optional user name for personalization
            
        Returns:
            dict: Response from Resend API
        """
        from_email = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")
        app_name = os.getenv("APP_NAME", "ExpenseTracker")
        app_url = os.getenv("APP_URL", "http://localhost:5173")
        
        greeting = f"Hi {user_name}," if user_name else "Hi there,"
        
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {app_name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #00F5C4 0%, #7B61FF 50%, #FF6B9D 100%); padding: 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                                  Welcome to {app_name}!
                            </h1>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                                {greeting}
                            </p>
                            
                            <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                                Thank you for joining {app_name}! We're excited to help you take control of your finances and achieve your financial goals.
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 10px 0 30px;">
                                        <a href="{app_url}" style="display: inline-block; background: linear-gradient(135deg, #00F5C4 0%, #7B61FF 50%, #FF6B9D 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-size: 16px; font-weight: 600;">
                                            Get Started
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 30px 40px; text-align: center;">
                            <p style="margin: 0; color: #999; font-size: 13px;">
                                © 2026 {app_name}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        """
        
        try:
            response = resend.Emails.send({
                "from": from_email,
                "to": to_email,
                "subject": f"Welcome to {app_name}!  ",
                "html": html_content
            })
            
            return {
                "success": True,
                "message": "Welcome email sent successfully",
                "email_id": response.get("id")
            }
            
        except Exception as e:
            logger.error(f"Error sending welcome email: {str(e)}")
            return {
                "success": False,
                "message": "Failed to send welcome email",
                "error": str(e)
            }

