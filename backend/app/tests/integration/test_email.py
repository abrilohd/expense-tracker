"""
Test script for Resend email service
Run this to verify email sending works before deploying
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add app directory to path
sys.path.insert(0, os.path.dirname(__file__))

from app.services.auth.email_service import EmailService

def test_password_reset_email():
    """
    Test sending a password reset email
    """
    print("=" * 60)
    print("TESTING PASSWORD RESET EMAIL")
    print("=" * 60)
    
    # Test email address (change this to your email)
    test_email = "abrsh067@gmail.com"
    test_token = "test_token_123456789_abcdefghijklmnop"
    test_name = "Test User"
    
    print(f"\n📧 Sending password reset email to: {test_email}")
    print(f"🔑 Reset token: {test_token}")
    print(f"👤 User name: {test_name}")
    print(f"\n⏳ Sending email...\n")
    
    # Send email
    result = EmailService.send_password_reset_email(
        to_email=test_email,
        reset_token=test_token,
        user_name=test_name
    )
    
    # Print result
    if result.get("success"):
        print("    SUCCESS! Email sent successfully")
        print(f"📬 Email ID: {result.get('email_id')}")
        print(f"\n💡 Check your inbox at: {test_email}")
        print(f"📱 Don't forget to check spam folder!")
        print(f"\n🔗 Reset URL would be:")
        app_url = os.getenv("APP_URL", "http://localhost:5173")
        print(f"   {app_url}/reset-password?token={test_token}")
    else:
        print("    FAILED! Email sending failed")
        print(f"Error: {result.get('error')}")
        print(f"\n🔍 Troubleshooting:")
        print(f"   1. Check RESEND_API_KEY in .env file")
        print(f"   2. Verify API key is valid at https://resend.com/api-keys")
        print(f"   3. Check Resend dashboard for errors")
    
    print("\n" + "=" * 60)
    return result.get("success")

def test_welcome_email():
    """
    Test sending a welcome email
    """
    print("\n" + "=" * 60)
    print("TESTING WELCOME EMAIL")
    print("=" * 60)
    
    test_email = "abrsh067@gmail.com"
    test_name = "Test User"
    
    print(f"\n📧 Sending welcome email to: {test_email}")
    print(f"👤 User name: {test_name}")
    print(f"\n⏳ Sending email...\n")
    
    result = EmailService.send_welcome_email(
        to_email=test_email,
        user_name=test_name
    )
    
    if result.get("success"):
        print("    SUCCESS! Welcome email sent successfully")
        print(f"📬 Email ID: {result.get('email_id')}")
    else:
        print("    FAILED! Welcome email sending failed")
        print(f"Error: {result.get('error')}")
    
    print("\n" + "=" * 60)
    return result.get("success")

def check_configuration():
    """
    Check if environment variables are configured
    """
    print("\n" + "=" * 60)
    print("CHECKING CONFIGURATION")
    print("=" * 60)
    
    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv("RESEND_FROM_EMAIL")
    app_name = os.getenv("APP_NAME")
    app_url = os.getenv("APP_URL")
    
    print(f"\n📋 Environment Variables:")
    print(f"   RESEND_API_KEY: {'    Set' if api_key else '    Not set'}")
    if api_key:
        print(f"      Value: {api_key[:10]}...{api_key[-10:]}")
    
    print(f"   RESEND_FROM_EMAIL: {'    Set' if from_email else '    Not set'}")
    if from_email:
        print(f"      Value: {from_email}")
    
    print(f"   APP_NAME: {'    Set' if app_name else '    Not set'}")
    if app_name:
        print(f"      Value: {app_name}")
    
    print(f"   APP_URL: {'    Set' if app_url else '    Not set'}")
    if app_url:
        print(f"      Value: {app_url}")
    
    all_set = all([api_key, from_email, app_name, app_url])
    
    if all_set:
        print(f"\n    All environment variables are configured!")
    else:
        print(f"\n    Some environment variables are missing!")
        print(f"\n💡 Make sure your .env file contains:")
        print(f"   RESEND_API_KEY=your-api-key")
        print(f"   RESEND_FROM_EMAIL=onboarding@resend.dev")
        print(f"   APP_NAME=ExpenseTracker")
        print(f"   APP_URL=http://localhost:5173")
    
    print("\n" + "=" * 60)
    return all_set

if __name__ == "__main__":
    print("\n🧪 RESEND EMAIL SERVICE TEST")
    print("=" * 60)
    
    # Check configuration first
    if not check_configuration():
        print("\n    Configuration check failed. Please fix environment variables.")
        sys.exit(1)
    
    # Test password reset email
    reset_success = test_password_reset_email()
    
    # Test welcome email
    welcome_success = test_welcome_email()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"\n    Password Reset Email: {'PASSED' if reset_success else 'FAILED'}")
    print(f"    Welcome Email: {'PASSED' if welcome_success else 'FAILED'}")
    
    if reset_success and welcome_success:
        print(f"\n  All tests passed! Email service is working correctly.")
        print(f"\n📧 Check your inbox at: abrsh067@gmail.com")
        print(f"📱 Don't forget to check spam folder!")
    else:
        print(f"\n    Some tests failed. Check the errors above.")
    
    print("\n" + "=" * 60)

