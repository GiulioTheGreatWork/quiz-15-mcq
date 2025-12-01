# Supabase Setup Guide

## Quick Fix: Why Emails Aren't Being Saved

If you've attempted the quiz but no data is appearing in Supabase, check these common issues:

### 1. Environment Variables Not Set

**For Local Development:**
- Create a `.env` file in the project root with:
  ```env
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key-here
  ```
- Restart your dev server after creating the file

**For GitHub Pages (Production):**
- Environment variables from `.env` files are NOT available in production builds
- You have two options:

  **Option A: Hardcode in code (Quick but less secure)**
  - Edit `src/supabase.js` and replace the empty strings with your actual values:
  ```javascript
  const supabaseUrl = 'https://your-project-id.supabase.co'
  const supabaseAnonKey = 'your-anon-key-here'
  ```
  - Then rebuild and redeploy:
  ```bash
  npm run build
  npm run deploy
  ```

  **Option B: Use GitHub Secrets (Recommended for production)**
  - Set up GitHub Actions to inject environment variables during build
  - This requires modifying the deployment workflow

### 2. Row Level Security (RLS) Policy Not Set

Even if your table exists, you need to allow anonymous inserts. Run this SQL in your Supabase SQL Editor:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'quiz_attempts';

-- Enable RLS if not already enabled
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create or replace the insert policy
DROP POLICY IF EXISTS "Allow anonymous inserts" ON quiz_attempts;

CREATE POLICY "Allow anonymous inserts" ON quiz_attempts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Verify the policy exists
SELECT * FROM pg_policies WHERE tablename = 'quiz_attempts';
```

### 3. Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab when you submit your email. You should see:
- ✅ "Attempting to save email to Supabase: your@email.com"
- ✅ "Email successfully saved to Supabase: [...]"
- ❌ OR error messages that will help identify the issue

### 4. Verify Supabase Connection

Test the connection directly in your browser console on the quiz page:
```javascript
// Check if Supabase is configured
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
```

### 5. Test Insert Manually

In Supabase SQL Editor, try inserting a test record:
```sql
INSERT INTO quiz_attempts (email, attempted_at)
VALUES ('test@example.com', NOW());
```

If this works, the table and RLS are set up correctly. If it fails, check your RLS policies.

## Getting Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon) in the left sidebar
3. Click on "API" under Project Settings
4. Copy:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon/public key** → Use as `VITE_SUPABASE_ANON_KEY`

## Troubleshooting Checklist

- [ ] `.env` file exists in project root (for local dev)
- [ ] Environment variables are set correctly in `.env`
- [ ] Dev server was restarted after creating `.env`
- [ ] For production: Values are hardcoded in `src/supabase.js` OR GitHub Actions is configured
- [ ] `quiz_attempts` table exists in Supabase
- [ ] RLS is enabled on the table
- [ ] Insert policy exists for `anon` role
- [ ] Browser console shows no errors
- [ ] Network tab shows successful POST request to Supabase

