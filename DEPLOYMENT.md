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
```

### 4. Deploy
- Click "Deploy"
- Wait ~2 minutes
- Get staging URL: `techandbusiness.vercel.app` (or similar)

### 5. Test Staging
- Visit the Vercel URL
- Test all pages
- Check mobile responsiveness
- Fix any issues

### 6. Domain Setup (Thursday)
In Vercel dashboard:
1. Go to Project Settings → Domains
2. Add custom domain: `techandbusiness.org`
3. Vercel will give you DNS records

In your domain registrar (where you bought the domain):
1. Update A record to point to Vercel's IP
2. Update CNAME for www subdomain
3. Wait for DNS propagation (~5-30 minutes)

### 7. Launch (Friday)
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
