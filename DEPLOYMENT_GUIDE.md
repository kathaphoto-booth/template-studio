# Vercel + Supabase + Cloudflare Setup Guide

This guide walks you through integrating Vercel, Supabase, and Cloudflare for your template-studio project.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User (Client)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare (DNS + CDN + Security)              │
│  • Caching                                                   │
│  • DDoS Protection                                           │
│  • Workers (Optional - Edge Functions)                      │
│  • Turnstile (Bot Protection)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│        Vercel (Frontend + API Routes + Edge Functions)      │
│  • Next.js Application                                       │
│  • Static Assets                                             │
│  • API Routes (/api/*)                                      │
│  • Environment Variables                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
    ┌─────────────────┐   ┌──────────────────┐
    │ Supabase Backend│   │ External APIs    │
    │ • Database      │   │ (Google AI, etc) │
    │ • Auth          │   │                  │
    │ • Storage       │   │                  │
    │ • Real-time     │   │                  │
    └─────────────────┘   └──────────────────┘
```

---

## Part 1: Supabase Setup

### Step 1.1: Create Supabase Project

1. Visit [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **New Project**
4. Configure:
   - **Name**: `katha-template-studio`
   - **Database Password**: Strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with Free tier

5. Wait for project to initialize (5-10 minutes)

### Step 1.2: Collect Credentials

1. Go to **Project Settings** → **API**
2. Copy and save:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY` (server-only!)

3. Go to **Project Settings** → **Database**
4. Note the **Database Password**

### Step 1.3: Set Up Authentication (Optional)

1. Go to **Authentication** → **Providers**
2. Enable desired providers:
   - Email/Password (built-in)
   - Google OAuth
   - GitHub OAuth
   - etc.

3. For each provider, get credentials and add redirect URL:
   ```
   https://template-studio-five.vercel.app/auth/callback
   https://localhost:3000/auth/callback (for local dev)
   ```

### Step 1.4: Create Database Tables (Example)

Go to **SQL Editor** and run:

```sql
-- Users table (extended from Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Templates table
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  preview_url TEXT,
  template_data JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('template-previews', 'template-previews', true),
  ('user-assets', 'user-assets', false);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read public profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can read public templates" 
  ON public.templates FOR SELECT 
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can insert own templates" 
  ON public.templates FOR INSERT 
  WITH CHECK (user_id = auth.uid());
```

---

## Part 2: Vercel Setup

### Step 2.1: Create Vercel Project

1. Visit [https://vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click **Add New** → **Project**
4. Select your **kathaphoto-booth/template-studio** repository
5. Configure:
   - **Project Name**: `template-studio`
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `.` (default)

6. Click **Deploy**

### Step 2.2: Add Environment Variables to Vercel

1. Go to project **Settings** → **Environment Variables**
2. Add the following:

| Variable | Value | Scope |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase | Production only |
| `NEXT_PUBLIC_API_URL` | `https://template-studio-five.vercel.app/api` | All |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY` | From Cloudflare | All |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | From Cloudflare | Production only |

3. **Important**: For `SUPABASE_SERVICE_ROLE_KEY`, ensure it's **Production only**

### Step 2.3: Get Your Vercel Deployment URL

After first deployment completes:
1. Go to **Deployments**
2. Copy the URL: `https://template-studio-five.vercel.app`
3. Update Supabase auth redirect URLs to this domain

### Step 2.4: Connect to Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions

---

## Part 3: Cloudflare Setup

### Step 3.1: Point Domain to Cloudflare

1. Visit [https://cloudflare.com](https://cloudflare.com)
2. Sign up or log in
3. Click **Add Site**
4. Enter your domain name
5. Choose plan (Free tier is sufficient)
6. Follow **Change Nameserver** instructions at your domain registrar

### Step 3.2: Configure DNS Records

1. In Cloudflare dashboard, go to **DNS**
2. Add CNAME record:

```
Name: @
Type: CNAME
Content: cname.vercel-dns.com
TTL: Auto
Proxy Status: Proxied (Orange Cloud)
```

3. Add records for subdomains (if needed):

```
Name: www
Type: CNAME
Content: cname.vercel-dns.com
TTL: Auto
Proxy Status: Proxied
```

### Step 3.3: Configure SSL/TLS

1. Go to **SSL/TLS** tab
2. Set **SSL/TLS encryption mode** to **Full (strict)**
3. Go to **Edge Certificates**
4. Enable:
   - ✅ Always Use HTTPS
   - ✅ Automatic HTTPS Rewrites
   - ✅ Minimum TLS Version: 1.2

### Step 3.4: Configure Security Rules

1. Go to **Security** → **WAF**
2. Enable **OWASP ModSecurity Core Rule Set**
3. Set Sensitivity to **Medium**

4. Go to **Security** → **Firewall Rules** (Optional)
5. Add rate limiting:

```
(cf.threat_score > 50) or (cf.bot_management.score < 30)
→ Action: Challenge
```

### Step 3.5: Optimize Performance

1. Go to **Caching** → **Configuration**
2. Set **Browser Cache TTL** to 4 hours
3. Enable **Rocket Loader** (optional - test compatibility)

4. Go to **Speed** → **Optimization**
5. Enable:
   - ✅ Brotli compression
   - ✅ Minify CSS/JavaScript
   - ✅ Polish (Image optimization)

### Step 3.6: Set Up Turnstile (Bot Protection)

1. Go to **Turnstile** (in left menu)
2. Click **Create Site**
3. Configure:
   - **Site name**: `template-studio`
   - **Domain**: Your domain
   - **Mode**: Managed Challenge

4. Copy:
   - **Site Key** → `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY`
   - **Secret Key** → `CLOUDFLARE_TURNSTILE_SECRET_KEY`

5. Add to Vercel environment variables

### Step 3.7 (Optional): Set Up Cloudflare Workers

1. Go to **Workers & Pages** → **Create** → **Create Worker**
2. Name it: `api-gateway`
3. Use this template for caching API responses:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Cache GET requests to /api/* for 60 seconds
    if (url.pathname.startsWith('/api/') && request.method === 'GET') {
      const cacheKey = new Request(url, { method: 'GET' });
      const cache = caches.default;
      let response = await cache.match(cacheKey);
      
      if (!response) {
        response = await fetch(request);
        if (response.status === 200) {
          response = new Response(response.body, response);
          response.headers.set('Cache-Control', 'max-age=60');
          await cache.put(cacheKey, response.clone());
        }
      }
      return response;
    }
    
    return fetch(request);
  }
};
```

4. Deploy and test

---

## Part 4: Application Integration

### Step 4.1: Install Dependencies

```bash
npm install @supabase/supabase-js @hookform/resolvers zod clsx tailwind-merge
npm install -D @types/node @types/react typescript
```

### Step 4.2: Create Supabase Client (`lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// For server-side operations only
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  : null;
```

### Step 4.3: Create Authentication Hook (`hooks/useAuth.ts`)

```typescript
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading };
}
```

### Step 4.4: Create API Route with Turnstile Verification

`pages/api/verify-turnstile.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ error: 'Verification failed' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

---

## Part 5: Deployment & Testing

### Step 5.1: Test Locally

```bash
# Create .env.local with your credentials
cp .env.example .env.local

# Install dependencies
npm install

# Run development server
npm run dev

# Visit http://localhost:3000
```

### Step 5.2: Test Production Build

```bash
# Build for production
npm run build

# Run production server locally
npm run start
```

### Step 5.3: Monitor Deployments

1. **Vercel Dashboard**: Check deployment logs and real-time metrics
2. **Supabase Dashboard**: Monitor database queries and API usage
3. **Cloudflare Dashboard**: Check analytics, security events, and performance

### Step 5.4: Verify Integration

- [ ] Frontend loads without errors
- [ ] Supabase client connects successfully
- [ ] Authentication works (if configured)
- [ ] API routes respond correctly
- [ ] Cloudflare caching works (check CF-Cache-Status header)
- [ ] Turnstile bot protection works
- [ ] Images load and are optimized
- [ ] SSL certificate is valid

---

## Part 6: Production Checklist

- [ ] All environment variables set in Vercel (no missing values)
- [ ] Supabase Row Level Security policies configured
- [ ] Email provider configured in Supabase
- [ ] CORS configured for Supabase
- [ ] Rate limiting enabled on API routes
- [ ] Error logging/monitoring set up (e.g., Sentry)
- [ ] Backup strategy for Supabase data
- [ ] CloudFlare SSL in Full (Strict) mode
- [ ] Security headers configured in Next.js
- [ ] Analytics configured (Vercel + Cloudflare)

---

## Troubleshooting

### Supabase Connection Issues
```bash
# Test Supabase connection
npm run dev
# Check browser console for auth errors
```

### Cloudflare DNS Issues
- Wait 24-48 hours for DNS propagation
- Clear browser cache (Ctrl+Shift+Delete)
- Use https://dnschecker.org to verify DNS

### Environment Variables Not Loading
1. Redeploy Vercel project after adding env vars
2. Check variable names match exactly
3. Verify scope (Production/Preview/Development)

### CORS Errors
Add to Supabase Project Settings → Auth → URL Configuration:
```
https://template-studio-five.vercel.app
https://localhost:3000
```

---

## Monitoring & Analytics

### Vercel Analytics
- Dashboard shows deployment frequency, build times
- Real-time logs available in Deployments tab

### Supabase Monitoring
- Database query performance in Logs
- Real-time subscription usage
- Storage usage tracking

### Cloudflare Analytics
- Traffic patterns and caching efficiency
- Security events and bot traffic
- Performance metrics and Core Web Vitals

---

## Next Steps

1. ✅ Deploy your application: Push code to GitHub
2. ✅ Share Vercel URL: `https://template-studio-five.vercel.app`
3. ✅ Set up monitoring and alerts
4. ✅ Configure custom domain (when ready)
5. ✅ Set up CI/CD with optimized workflows

For support:
- **Vercel**: [https://vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [https://supabase.com/docs](https://supabase.com/docs)
- **Cloudflare**: [https://developers.cloudflare.com/](https://developers.cloudflare.com/)
