"""
Email service using Resend API
Handles sending password reset emails and other notifications
"""
import os
import resend
from typing import Optional
from app.core.config import settings

# Initialize Resend with API key
resend.api_key = os.getenv("RESEND_API_KEY", "")

class EmailService:
    """
    Email service for sending transactional emails
    """
    
    @staticmethod
    def send_password_reset_email(
        to_email: str,
        reset_token: str,
        user_name: Optional[str] = None
    ) -> dict:
        """
        Send password reset email with reset link
        
        Args:
            to_email: Recipient email address
            reset_token: Password reset token
            user_name: Optional user name for personalization
            
        Returns:
            dict: Response from Resend API
        """
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
            # Send email using Resend
            response = resend.Emails.send({
                "from": from_email,
                "to": to_email,
                "subject": f"Reset Your {app_name} Password",
                "html": html_content,
                "text": text_content
            })
            
            return {
                "success": True,
                "message": "Password reset email sent successfully",
                "email_id": response.get("id")
            }
            
        except Exception as e:
            # Log error but don't expose details to user
            print(f"Error sending email: {str(e)}")
            return {
                "success": False,
                "message": "Failed to send email",
                "error": str(e)
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
                                🎉 Welcome to {app_name}!
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
                "subject": f"Welcome to {app_name}! 🎉",
                "html": html_content
            })
            
            return {
                "success": True,
                "message": "Welcome email sent successfully",
                "email_id": response.get("id")
            }
            
        except Exception as e:
            print(f"Error sending welcome email: {str(e)}")
            return {
                "success": False,
                "message": "Failed to send welcome email",
                "error": str(e)
            }

