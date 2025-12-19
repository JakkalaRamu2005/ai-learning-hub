# Environment Variables Setup

## Required Environment Variables

Add these environment variables to your Vercel deployment:

### 1. MongoDB Connection
```
MONGODB_URI=your_mongodb_connection_string
```

### 2. Google OAuth Credentials
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. NextAuth Configuration (IMPORTANT!)
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_random_secret_key_here
```

## How to Generate NEXTAUTH_SECRET

You can generate a secure secret using one of these methods:

### Method 1: Using OpenSSL (Terminal/Command Line)
```bash
openssl rand -base64 32
```

### Method 2: Using Online Generator
Visit: https://generate-secret.vercel.app/32

### Method 3: Using Node.js
```javascript
require('crypto').randomBytes(32).toString('base64')
```

## Adding to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Make sure to add them for **Production**, **Preview**, and **Development** environments
5. Redeploy your application

## Important Notes

- **NEXTAUTH_URL** must match your actual deployment URL (e.g., `https://your-app.vercel.app`)
- **NEXTAUTH_SECRET** must be a strong random string (at least 32 characters)
- For local development, create a `.env.local` file with these variables
- Never commit `.env` files to Git (they're already in `.gitignore`)

## Google OAuth Setup

Make sure your Google OAuth redirect URIs include:
- `https://your-domain.vercel.app/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/google` (for local development)
