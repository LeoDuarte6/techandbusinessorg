# Tech & Business - Project Context for Claude

## Project Overview
Tech & Business is a student-run media platform covering technology, business, and finance. The website features articles, podcasts, and video content created by a team of student contributors.

## Tech Stack
- **Frontend**: Astro (SSG framework)
- **CMS**: Sanity.io (headless CMS)
- **Styling**: Tailwind CSS + Custom CSS
- **Hosting**: TBD (currently local development)
- **Content Source**: Migrated from Beehiiv newsletter platform

## Project Structure
```
techandbusinessorg/
├── astro-frontend/          # Main Astro website
│   ├── src/
│   │   ├── pages/           # Route pages
│   │   ├── components/      # Reusable components
│   │   ├── layouts/         # Layout templates
│   │   ├── lib/             # Utilities (Sanity client)
│   │   └── styles/          # Global CSS
│   └── public/              # Static assets (favicon, etc.)
├── sanity-studio/           # Sanity CMS configuration
│   └── schemas/             # Content schemas (post, author, video, episode)
└── migration/               # Data migration scripts from Beehiiv
```

## Key Features Implemented
1. **Article System**
   - Dynamic article pages with proper formatting
   - Author attribution with profile pictures
   - Read time estimation
   - Related articles ("Keep Reading" section)
   - Filter/sort by author, date, and read time

2. **Author Pages**
   - Individual author profile pages (`/authors/[slug]`)
   - Author bio, headshot, role
   - List of articles by author

3. **Content Types**
   - Articles (long-form written content)
   - Podcast episodes
   - Video content ("Quick Takes")

4. **Design System**
   - Dark mode by default
   - Clean, modern aesthetic
   - Proper typography (Inter font)
   - Responsive layout
   - Gradient accents (black/grey theme)

## Content Migration Status
✅ All articles migrated from Beehiiv CSV export
✅ Article content cleaned (removed email footers, ads, duplicate titles)
✅ Paragraph breaks properly preserved
✅ Author assignments complete
✅ "-Leo." signature restored where appropriate
✅ Bold text support in articles
✅ Weekly edition articles deleted

## Current Authors
1. **Leo Duarte** - Founding Staff, Chief Business Development Officer
2. **Pierce Berke** - Co-founder
3. **Peter Gao** - Infrastructure Lead
4. **Joey Summa** - Founding Staff & Finance

## Design Philosophy
- **Premium & Modern**: Avoid basic MVP aesthetics - aim for polished, professional design
- **Clean & Readable**: Proper spacing, clear typography, easy navigation
- **Minimalist**: No unnecessary elements, focus on content
- **Dark Theme**: Black background with white text, grey accents
- **Subtle Animations**: Hover effects, smooth transitions

## Known Issues & TODOs
- [ ] Deploy to production (currently local only)
- [ ] Set up email subscription system
- [ ] Mobile responsiveness testing
- [ ] Add gradient backgrounds/accents
- [ ] Implement search functionality
- [ ] Add RSS feed
- [ ] Set up analytics

## Environment Variables
Located in `astro-frontend/.env`:
- `PUBLIC_SANITY_PROJECT_ID`: 5gz8vb6c
- `PUBLIC_SANITY_DATASET`: production
- `PUBLIC_SANITY_API_VERSION`: 2024-03-19

## Development Commands
```bash
# Frontend dev server
cd astro-frontend
npm run dev  # Runs on localhost:4321

# Sanity Studio
cd sanity-studio
npm run dev  # Runs on localhost:3333

# Build for production
cd astro-frontend
npm run build
```

## Important Files to Know
- `astro-frontend/src/pages/articles/[slug].astro` - Article detail page
- `astro-frontend/src/pages/articles.astro` - Articles listing with filters
- `astro-frontend/src/pages/authors/[slug].astro` - Author profile pages
- `astro-frontend/src/layouts/BaseLayout.astro` - Main layout wrapper
- `astro-frontend/src/styles/global.css` - Global styles and CSS variables
- `sanity-studio/schemas/post.ts` - Article content schema
- `sanity-studio/schemas/author.ts` - Author schema

## Sanity Content Structure
### Post (Article)
- title, slug, publishedAt, excerpt
- body (Portable Text)
- mainImage (optional)
- author (reference to Author)
- readTime (calculated)

### Author
- name, slug, role
- headshot (image)
- bio (text)
- socialLinks (array)

### Episode (Podcast)
- title, slug, publishedAt
- description, audioUrl
- hosts, guests (references to Authors)

### Video
- title, slug, publishedAt
- videoUrl, thumbnail
- description

## Migration Scripts (in /migration)
- `beehiiv-to-sanity.js` - Initial import from CSV
- `restore-with-breaks.js` - Re-import with proper paragraph breaks
- `clean-artifacts.js` - Remove header/footer artifacts
- `remove-copyright.js` - Remove copyright blocks
- `remove-ad-blocks.js` - Remove advertisement content
- `delete-weekly.js` - Delete weekly edition posts
- `create-authors.js` - Set up author documents
- `assign-authors.js` - Link articles to authors

## Design Tokens (CSS Variables)
```css
--theme-bg: #000000 (black background)
--theme-text: #ffffff (white text)
--theme-accent: #ffffff
--theme-border: #333333 (dark grey borders)
--theme-gray: #666666 (medium grey)
--theme-gray-light: #333333 (light grey backgrounds)
```

## User's Vision & Direction
- **Professional Publication**: Not a hobby blog - aim for Bloomberg/TechCrunch quality
- **Student Voice**: Authentic student perspective on tech/business
- **Clean Design**: Inspired by modern media sites, avoid clutter
- **Content First**: Design should enhance, not distract from content
- **Growth Oriented**: Built to scale as the team and audience grows
