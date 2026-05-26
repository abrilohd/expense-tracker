# Environment Variables

Complete guide to environment variables for the Expense Tracker application.

## Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

### Required Variables

```env
# Database Configuration
DATABASE_URL=sqlite:///./expenses.db
# For PostgreSQL: postgresql://user:password@localhost:5432/expense_tracker

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Application
APP_NAME=Expense Tracker API
DEBUG=False
```

### Optional Variables

```env
# Email Configuration (for password reset)
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

### Environment-Specific Configurations

#### Development
```env
DATABASE_URL=sqlite:///./expenses.db
DEBUG=True
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Production
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
DEBUG=False
SECRET_KEY=generate-a-strong-random-key
CORS_ORIGINS=https://yourdomain.com
```

### Generating SECRET_KEY

Use Python to generate a secure secret key:

```python
import secrets
print(secrets.token_urlsafe(32))
```

Or use OpenSSL:

```bash
openssl rand -hex 32
```

---

## Frontend Environment Variables

Create a `.env` file in the `frontend/` directory with the following variables:

### Required Variables

```env
# API Configuration
VITE_API_URL=http://localhost:8000
```

### Optional Variables

```env
# Application URLs
VITE_APP_URL=http://localhost:5173
VITE_LANDING_URL=http://localhost:3000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_GOOGLE_AUTH=false
```

### Environment-Specific Configurations

#### Development
```env
VITE_API_URL=http://localhost:8000
VITE_APP_URL=http://localhost:5173
VITE_LANDING_URL=http://localhost:3000
```

#### Production
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_URL=https://app.yourdomain.com
VITE_LANDING_URL=https://yourdomain.com
```

---

## Landing Page Environment Variables

Create a `.env` file in the `landing-page/` directory (if needed):

```env
# Application URLs
APP_URL=http://localhost:5173
API_URL=http://localhost:8000
```

---

## Environment Variable Security

### ⚠️ Security Best Practices

1. **Never commit `.env` files to version control**
   - Already included in `.gitignore`
   - Use `.env.example` as a template

2. **Use strong SECRET_KEY in production**
   - Minimum 32 characters
   - Use cryptographically secure random generation
   - Never use default or example keys

3. **Rotate secrets regularly**
   - Change SECRET_KEY periodically
   - Update API keys when compromised
   - Revoke old tokens after rotation

4. **Use environment-specific values**
   - Different keys for dev/staging/production
   - Separate databases per environment
   - Restrict CORS origins in production

5. **Secure storage**
   - Use secret management services (AWS Secrets Manager, HashiCorp Vault)
   - Never log sensitive values
   - Encrypt secrets at rest

---

## Deployment Platforms

### Vercel (Frontend)

Add environment variables in Vercel dashboard:

```
VITE_API_URL=https://your-backend-url.com
VITE_APP_URL=https://your-app.vercel.app
```

### Railway (Backend)

Add environment variables in Railway dashboard:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://your-frontend.vercel.app
```

Railway automatically provides `DATABASE_URL` when you add a PostgreSQL database.

### Heroku (Backend)

```bash
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DATABASE_URL=postgresql://...
heroku config:set CORS_ORIGINS=https://your-frontend.com
```

### Render (Backend)

Add environment variables in Render dashboard:

```
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://your-frontend.com
```

---

## Accessing Environment Variables

### Backend (Python/FastAPI)

```python
from app.core.config import settings

# Access variables
database_url = settings.database_url
secret_key = settings.secret_key
```

Configuration is defined in `backend/app/core/config.py`:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    
    class Config:
        env_file = ".env"
```

### Frontend (TypeScript/React)

```typescript
// Access variables (must start with VITE_)
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
```

Type definitions in `frontend/src/vite-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_URL: string
  readonly DEV: boolean
  readonly PROD: boolean
}
```

---

## Troubleshooting

### Backend: Environment variables not loading

1. Check `.env` file exists in `backend/` directory
2. Verify file is named exactly `.env` (not `.env.txt`)
3. Ensure no spaces around `=` in variable definitions
4. Restart the backend server after changes

### Frontend: Environment variables undefined

1. Check `.env` file exists in `frontend/` directory
2. Verify variables start with `VITE_` prefix
3. Restart Vite dev server after changes (`npm run dev`)
4. Clear browser cache if needed

### Database connection fails

1. Verify `DATABASE_URL` format is correct
2. Check database server is running
3. Verify credentials are correct
4. Check network connectivity

### CORS errors

1. Verify `CORS_ORIGINS` includes your frontend URL
2. Check protocol (http vs https) matches
3. Ensure no trailing slashes in URLs
4. Restart backend after CORS changes

---

## Example Files

### backend/.env.example

```env
# Database
DATABASE_URL=sqlite:///./expenses.db

# Security
SECRET_KEY=change-this-to-a-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Email (optional)
RESEND_API_KEY=
FROM_EMAIL=noreply@example.com

# CORS
CORS_ORIGINS=http://localhost:5173
```

### frontend/.env.example

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# Application URLs
VITE_APP_URL=http://localhost:5173
VITE_LANDING_URL=http://localhost:3000
```

---

## Migration Checklist

When moving between environments:

- [ ] Copy `.env.example` to `.env`
- [ ] Update all placeholder values
- [ ] Generate new SECRET_KEY for production
- [ ] Update DATABASE_URL for target environment
- [ ] Update CORS_ORIGINS with actual frontend URL
- [ ] Configure email service credentials
- [ ] Test all environment variables load correctly
- [ ] Verify application connects to correct services
- [ ] Document any custom variables added

---

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Pydantic Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- [FastAPI Configuration](https://fastapi.tiangolo.com/advanced/settings/)
- [12-Factor App Config](https://12factor.net/config)

---

For deployment instructions, see [README.md](./README.md) and [DEVELOPMENT.md](./DEVELOPMENT.md).
