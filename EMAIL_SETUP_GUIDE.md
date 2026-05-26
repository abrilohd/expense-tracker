# Email Setup Guide

Complete guide for configuring email functionality in the Expense Tracker application.

## Overview

The application uses [Resend](https://resend.com) for sending transactional emails (password reset, welcome emails, etc.). Email functionality is **optional** - the application works without it, but password reset will require manual intervention.

---

## Quick Start (Development)

### Option 1: Skip Email Configuration (Recommended for Development)

The application works perfectly without email configuration. When email is not configured:

1. **Password Reset**: The reset token will be returned in the API response (DEBUG mode only)
2. **Development Mode**: Set `DEBUG=True` in `.env`
3. **Testing**: Use the returned token directly

**Example Response** (when DEBUG=True and email not configured):
```json
{
  "message": "Email service not configured. Use the token below for testing.",
  "reset_token": "abc123def456...",
  "reset_url": "http://localhost:5173/reset-password?token=abc123def456...",
  "dev_mode": true
}
```

### Option 2: Configure Resend (For Full Email Functionality)

Follow the steps below to set up Resend.

---

## Resend Setup (Production & Full Development)

### Step 1: Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" or "Get Started"
3. Create an account (free tier available)
4. Verify your email address

### Step 2: Get API Key

1. Log in to Resend dashboard
2. Go to **API Keys** section
3. Click "Create API Key"
4. Give it a name (e.g., "Expense Tracker Dev")
5. Select permissions: **Sending access**
6. Click "Create"
7. **Copy the API key** (you won't see it again!)

### Step 3: Configure Domain (Optional but Recommended)

#### For Development (Use Default)
- Use `onboarding@resend.dev` (no setup needed)
- Limited to 100 emails/day
- Good for testing

#### For Production (Custom Domain)
1. Go to **Domains** in Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add DNS records as instructed:
   - **MX Record**: For receiving bounces
   - **TXT Record**: For SPF authentication
   - **CNAME Records**: For DKIM authentication
5. Wait for verification (usually 5-30 minutes)
6. Once verified, use `noreply@yourdomain.com`

### Step 4: Update Environment Variables

Edit `backend/.env`:

```env
# Email Configuration
RESEND_API_KEY=re_123456789_YourActualAPIKey
RESEND_FROM_EMAIL=onboarding@resend.dev  # or noreply@yourdomain.com
APP_NAME=ExpenseTracker
APP_URL=http://localhost:5173  # or your production URL
```

### Step 5: Test Email

1. Restart backend server
2. Try password reset:
   ```bash
   curl -X POST http://localhost:8000/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email": "your-test-email@example.com"}'
   ```
3. Check your email inbox
4. Check backend logs for any errors

---

## Environment Variables Reference

### Required for Email

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Optional (with defaults)

```env
RESEND_FROM_EMAIL=onboarding@resend.dev
APP_NAME=ExpenseTracker
APP_URL=http://localhost:5173
DEBUG=True  # Set to False in production
```

---

## Email Templates

### Password Reset Email

**Subject**: Reset Your Password - ExpenseTracker

**Content**:
- Personalized greeting
- Reset link (valid for 1 hour)
- Security notice
- Support information

**Example**:
```
Hi John,

We received a request to reset your password for your ExpenseTracker account.

Click the button below to reset your password:
[Reset Password Button]

This link will expire in 1 hour for security reasons.

If you didn't request this, please ignore this email.

Best regards,
The ExpenseTracker Team
```

---

## Troubleshooting

### Issue: "API key is invalid"

**Cause**: RESEND_API_KEY is not set or incorrect

**Solutions**:
1. Check `.env` file has correct API key
2. Ensure no extra spaces in API key
3. Verify API key is active in Resend dashboard
4. Restart backend server after changing `.env`

**Development Workaround**:
- Set `DEBUG=True` in `.env`
- API will return reset token in response
- Use token directly for testing

### Issue: "Email not received"

**Possible Causes**:
1. Email in spam folder
2. Invalid recipient email
3. Resend daily limit reached (100 for free tier)
4. Domain not verified (if using custom domain)

**Solutions**:
1. Check spam/junk folder
2. Verify email address is correct
3. Check Resend dashboard for delivery status
4. Verify domain DNS records
5. Check backend logs for errors

### Issue: "Failed to send email"

**Check**:
1. Backend logs for detailed error
2. Resend dashboard for API status
3. Network connectivity
4. API key permissions

**Debug**:
```bash
# Check backend logs
tail -f backend/logs/app.log

# Or check console output
# Look for lines starting with "Error sending email:"
```

### Issue: Reset link doesn't work

**Possible Causes**:
1. Token expired (1 hour limit)
2. Token already used
3. Wrong APP_URL in .env

**Solutions**:
1. Request new reset link
2. Check APP_URL matches frontend URL
3. Verify token in database hasn't expired

---

## Production Deployment

### Vercel Frontend

Set environment variable:
```
VITE_API_URL=https://your-backend-url.railway.app
```

### Railway Backend

Set environment variables:
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
APP_NAME=ExpenseTracker
APP_URL=https://your-frontend.vercel.app
DEBUG=False
```

### Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Set DEBUG=False** in production
4. **Use custom domain** for professional emails
5. **Monitor email delivery** in Resend dashboard
6. **Set up SPF/DKIM** for better deliverability
7. **Rotate API keys** periodically

---

## Alternative Email Providers

If you prefer not to use Resend, you can modify `backend/app/services/email_service.py` to use:

### SendGrid
```python
import sendgrid
from sendgrid.helpers.mail import Mail

sg = sendgrid.SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY'))
```

### Mailgun
```python
import requests

requests.post(
    "https://api.mailgun.net/v3/YOUR_DOMAIN/messages",
    auth=("api", os.getenv('MAILGUN_API_KEY')),
    data={"from": "...", "to": "...", "subject": "...", "html": "..."}
)
```

### AWS SES
```python
import boto3

client = boto3.client('ses', region_name='us-east-1')
client.send_email(...)
```

### SMTP (Any Provider)
```python
import smtplib
from email.mime.text import MIMEText

msg = MIMEText(html_content, 'html')
with smtplib.SMTP('smtp.gmail.com', 587) as server:
    server.starttls()
    server.login(username, password)
    server.send_message(msg)
```

---

## Testing Checklist

- [ ] API key configured in `.env`
- [ ] Backend server restarted
- [ ] Password reset request sent
- [ ] Email received in inbox
- [ ] Reset link works
- [ ] Token expires after 1 hour
- [ ] Used token cannot be reused
- [ ] Logs show no errors

---

## Cost Estimation

### Resend Pricing (as of 2024)

**Free Tier**:
- 100 emails/day
- 3,000 emails/month
- Perfect for development and small projects

**Pro Plan** ($20/month):
- 50,000 emails/month
- Custom domains
- Priority support
- Analytics

**Enterprise**:
- Custom pricing
- Dedicated IP
- Advanced features

### Typical Usage

- **Small app** (100 users): ~10-20 emails/day (password resets, notifications)
- **Medium app** (1,000 users): ~50-100 emails/day
- **Large app** (10,000+ users): Consider Pro plan

---

## FAQ

### Q: Is email required for the app to work?
**A**: No, email is optional. The app works without it, but password reset requires manual intervention.

### Q: Can I use Gmail for sending emails?
**A**: Not recommended. Gmail has strict sending limits and may block automated emails. Use a transactional email service like Resend.

### Q: How do I test email in development?
**A**: Set `DEBUG=True` and the API will return the reset token in the response. Or use a real email service.

### Q: What happens if email fails to send?
**A**: The app logs the error but still returns success to prevent email enumeration attacks. Check logs for details.

### Q: Can I customize email templates?
**A**: Yes, edit `backend/app/services/email_service.py` to modify the HTML templates.

### Q: How do I monitor email delivery?
**A**: Check the Resend dashboard for delivery status, opens, clicks, and bounces.

---

## Support

- **Resend Documentation**: https://resend.com/docs
- **Resend Support**: support@resend.com
- **Project Issues**: Check backend logs and Resend dashboard

---

## Next Steps

1. ✅ Choose email configuration option
2. ✅ Set up Resend account (if using email)
3. ✅ Configure environment variables
4. ✅ Test password reset flow
5. ✅ Monitor email delivery
6. ✅ Set up custom domain (production)

---

For more information, see:
- [ENVIRONMENT.md](./ENVIRONMENT.md) - Environment variables guide
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
