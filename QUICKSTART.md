# Tech & Business - Quick Start Guide

## ⚠️ IMPORTANT: Node.js Version

Your current Node.js version (18.0.0) is too old. You need 18.20.8 or higher.

**Upgrade now:**
```bash
# Check current version
node --version

# Using nvm (recommended)
nvm install 18.20.8
nvm use 18.20.8

# Verify
node --version  # Should show v18.20.8 or higher
```

## 🎯 Today's Goals (Before Work at 3pm)

### 1. Upgrade Node.js (5 minutes)
Follow the instructions above.

### 2. Set Up Sanity CMS (10 minutes)
```bash
cd sanity-studio
npm install -g @sanity/cli
sanity login  # Creates free account
sanity init   # Follow prompts, select "Create new project"
```

**Save the Project ID** it gives you!

Then edit `sanity.config.ts`:
```typescript
projectId: 'paste-your-project-id-here',
```

### 3. Start Sanity Studio (1 minute)
```bash
npm run dev
```

Opens at `http://localhost:3333` - this is your admin panel!

### 4. Add Team Members (5 minutes)
In Sanity Studio:
- Click "Author" → Create entries for Leo, Pierce, Joey
- Add roles and bios
- Upload headshots (optional for now)

### 5. Test the Frontend (5 minutes)
```bash
cd ../astro-frontend
cp .env.example .env
# Edit .env and add your Sanity project ID
npm run dev
```

Opens at `http://localhost:4321`

## 🎬 Wednesday Podcast Workflow

Before filming:
1. Open Sanity Studio
2. Create "Podcast Episode" entry
3. Add title, episode number, select hosts (Leo, Pierce, Joey)

After filming:
1. Upload to Spotify/Apple Podcasts
2. Get embed code
3. Paste into Sanity episode entry
4. Publish

The episode automatically appears on your website!

## 📱 Creating Reels

Joey wants to create a reel tonight:

1. Film the reel on phone
2. Upload to TikTok/Instagram
3. Copy the URL
4. Open Sanity Studio (`http://localhost:3333`)
5. Click "Video/Reel" → "Create new"
6. Paste URL, select Joey as anchor, choose category
7. Publish

Done! It's now on the website.

## 🚀 Deployment (When Ready)

### Deploy Sanity Studio
```bash
cd sanity-studio
npm run deploy
```

Gets you a URL like `https://techandbusiness.sanity.studio`
Share this with Pierce and Joey - they can log in and create content!

### Deploy Website to Hostinger
```bash
cd astro-frontend
npm run build
```

Upload the `dist/` folder to Hostinger's `public_html` directory.

## 💡 Key Points

- **You (Leo)**: Handle infrastructure, design, deployment
- **Pierce & Joey**: Just use Sanity Studio to create content - no coding!
- **Mobile-first**: Everything is responsive
- **Black & White**: Bloomberg-inspired minimalist design
- **Video-first**: Reels and podcasts are the priority

## 🆘 Need Help?

**Sanity won't start**: Make sure you ran `sanity init` and added your project ID to `sanity.config.ts`

**Website shows errors**: Check that `.env` has your Sanity credentials

**Node version errors**: You MUST upgrade to Node 18.20.8+

---

You've got this! The infrastructure is built, now it's just configuration and content creation.
