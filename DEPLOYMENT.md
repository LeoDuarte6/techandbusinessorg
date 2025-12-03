# Vercel Deployment Guide

## Quick Deploy Steps

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/new
- Click "Import Project"

### 2. Import from GitHub
- Select: `LeoDuarte6/techandbusinessorg`
- Vercel will auto-detect the configuration from `vercel.json`

### 3. Configure Environment Variables
Add these in Vercel dashboard:
```
PUBLIC_SANITY_PROJECT_ID=5gz8vb6c
PUBLIC_SANITY_DATASET=production
PUBLIC_SUPABASE_URL=https://bkmvkbxjwndkjhjzlrtu.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZrYnh2d25ka2poanpscnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NzM3NjEsImV4cCI6MjA0ODE0OTc2MX0.rdjI_f1nGKl3AURbzK3VLQ_ofpwC3SP
```

### 4. Set Up Supabase Database (First-Time Only)
Before deploying, you need to create the database tables for user tracking:

1. Go to https://app.supabase.com/project/bkmvkbxjwndkjhjzlrtu/sql
2. Click "New Query"
3. Copy and paste the SQL from `setup-supabase-db.sh` (lines 13-57)
4. Click "Run" to execute the SQL
5. Verify tables were created in the "Table Editor" section

This creates the `user_articles` and `user_podcasts` tables with proper security policies.

### 5. Deploy
- Click "Deploy"
- Wait ~2 minutes
- Get staging URL: `techandbusiness.vercel.app` (or similar)

### 6. Test Staging
- Visit the Vercel URL
- Test all pages
- Check mobile responsiveness
- Fix any issues

### 7. Domain Setup (Thursday)
In Vercel dashboard:
1. Go to Project Settings → Domains
2. Add custom domain: `techandbusiness.org`
3. Vercel will give you DNS records

In your domain registrar (where you bought the domain):
1. Update A record to point to Vercel's IP
2. Update CNAME for www subdomain
3. Wait for DNS propagation (~5-30 minutes)

### 8. Launch (Friday)
- Verify techandbusiness.org loads the new site
- Monitor for issues
- Announce on social media

## Rollback Plan
If something breaks:
1. Go to domain registrar
2. Point DNS back to Beehiiv
3. Fix issues on Vercel staging
4. Re-deploy when ready

## Notes
- Vercel auto-deploys on every push to `main` branch
- Preview URLs created for every PR
- Free tier includes 100GB bandwidth/month
- SSL certificate auto-generated and renewed
