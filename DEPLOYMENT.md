# LinkBird Deployment Guide

## Vercel Deployment Configuration

To ensure proper authentication functionality in the deployed application, follow these steps:

### 1. Environment Variables

Set the following environment variables in your Vercel project settings:

```
# Database
DATABASE_URL=your_postgresql_connection_string_here

# Better Auth
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=https://linkbird-clone-kmqf.vercel.app
NEXT_PUBLIC_APP_URL=https://linkbird-clone-kmqf.vercel.app

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2. Deployment Settings

1. **Build Command**: `npm run build`
2. **Output Directory**: `.next`
3. **Install Command**: `npm install`

### 3. Database Setup

Ensure your PostgreSQL database is properly set up and accessible from Vercel:

1. Use a cloud PostgreSQL provider (like Neon, Supabase, or Railway)
2. Make sure the database connection string is correctly set in the `DATABASE_URL` environment variable
3. Run database migrations using Drizzle:
   ```bash
   npm run db:push
   ```

### 4. Authentication Configuration

The authentication system is configured to work with the Vercel deployment. Make sure:

1. The `BETTER_AUTH_SECRET` is a strong, random string
2. The `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` match your Vercel deployment URL
3. If using Google OAuth, ensure the redirect URIs in your Google Cloud Console project include your Vercel deployment URL

### 5. Troubleshooting

If you encounter authentication issues:

1. Check that all environment variables are correctly set in Vercel
2. Verify the database connection is working
3. Clear browser cookies and try again
4. Check Vercel logs for any errors