# Tech & Business Website

A modern, video-first media platform built with Astro and Sanity CMS.

## 🏗️ Project Structure

```
tech-and-business/
├── astro-frontend/          # Main website (Astro + Tailwind CSS)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── layouts/         # Page layouts
│   │   ├── pages/           # Routes
│   │   ├── lib/             # Sanity client & utilities
│   │   └── styles/          # Global styles
│   └── public/              # Static assets
├── sanity-studio/           # CMS admin panel
│   └── schemas/             # Content type definitions
└── migration/               # Content migration scripts
```

## 🚀 Getting Started

### Prerequisites

**IMPORTANT**: This project requires Node.js version 18.20.8 or higher. Your current version (18.0.0) is too old.

To upgrade Node.js:
```bash
# Using nvm (recommended)
nvm install 18.20.8
nvm use 18.20.8

# Or download from nodejs.org
```

### 1. Set Up Sanity CMS

First, create a free Sanity account and project:

```bash
cd sanity-studio
npm install -g @sanity/cli
sanity login
sanity init
```

When prompted:
- Select "Create new project"
- Name it "Tech & Business"
- Use dataset name: "production"
- Copy the Project ID it gives you

Then update `sanity.config.ts` with your project ID:
```typescript
projectId: 'your-actual-project-id-here',
```

Start the Sanity Studio:
```bash
npm run dev
```

This will open the admin panel at `http://localhost:3333`

### 2. Add Your Team Members

In Sanity Studio:
1. Go to "Author" content type
2. Create entries for Leo, Pierce, and Joey
3. Add photos, bios, and roles

### 3. Configure the Frontend

```bash
cd ../astro-frontend
cp .env.example .env
```

Edit `.env` and add your Sanity project details:
```
PUBLIC_SANITY_PROJECT_ID=your-project-id-here
PUBLIC_SANITY_DATASET=production
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:4321` to see your site!

## 📝 Content Management

### Adding Videos/Reels

1. Open Sanity Studio (`http://localhost:3333`)
2. Click "Video/Reel" → "Create new"
3. Fill in:
   - Title
   - Select the anchor (Leo/Pierce/Joey)
   - Paste the video URL (TikTok, Instagram, or YouTube)
   - Select platform
   - Choose category
4. Publish

The video will automatically appear on your website!

### Writing Articles

1. In Sanity Studio, click "Article" → "Create new"
2. Add title, featured image, and content
3. Select the author
4. The slug will auto-generate from the title
5. Add an excerpt for the preview card
6. Publish

### Publishing Podcast Episodes

1. Upload your podcast to Spotify/Apple Podcasts first
2. Get the embed code from the platform
3. In Sanity Studio, create new "Podcast Episode"
4. Paste the embed code
5. Add show notes, select hosts/guests
6. Publish

## 🎨 Design System

- **Colors**: Strict black (#000) and white (#FFF) palette
- **Typography**: Inter font family
- **Aesthetic**: Bloomberg/WSJ minimalist editorial style
- **Mobile-first**: Fully responsive design

## 🚢 Deployment

### Deploy Sanity Studio

```bash
cd sanity-studio
npm run deploy
```

This gives you a URL like `https://techandbusiness.sanity.studio`

### Deploy Website to Hostinger

1. Build the production site:
```bash
cd astro-frontend
npm run build
```

2. Upload the `dist/` folder contents to Hostinger:
   - Log into Hostinger File Manager
   - Navigate to `public_html`
   - Upload all files from `dist/`

3. Your site will be live at `techandbusiness.org`!

## 📦 Migration from Beehiiv

To import your existing articles:

1. Export from Beehiiv (Settings → Export → Posts as CSV)
2. Place the CSV in the `migration/` folder
3. Run the migration script (coming soon)

## 🔧 Troubleshooting

**"Unsupported engine" errors**: Upgrade to Node.js 18.20.8+

**Sanity Studio won't start**: Make sure you've run `sanity init` and added your project ID

**Website shows placeholder data**: Check that your `.env` file has the correct Sanity credentials

## 👥 Team Workflow

**Leo**: Technical infrastructure, design, deployment
**Pierce & Joey**: Content creation via Sanity Studio

No coding required for Pierce and Joey - just log into Sanity Studio and create content!

## 📚 Tech Stack

- **Frontend**: Astro 4.x
- **Styling**: Tailwind CSS
- **CMS**: Sanity.io
- **Hosting**: Hostinger (website) + Sanity Cloud (CMS)
- **Deployment**: Static build

## 🎯 Next Steps

1. ✅ Upgrade Node.js
2. ✅ Set up Sanity project
3. ✅ Add team member profiles
4. ⬜ Create first video entry
5. ⬜ Import Beehiiv articles
6. ⬜ Deploy to production

---

Built with ❤️ by the Tech & Business team
