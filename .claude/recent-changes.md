# Recent Changes & Current State

## Last Updated: 2025-11-24

## Recent Major Changes

### Article Content Cleanup (Nov 24, 2025)
**Problem**: Articles imported from Beehiiv had formatting issues:
- Wall of text with no paragraph breaks
- Email footer artifacts (unsubscribe links, addresses)
- Advertisement blocks ("In partnership with Long Angle")
- Duplicate titles in article body
- Copyright blocks at end of articles
- Missing "-Leo." signature

**Solution**:
1. Created `migration/restore-with-breaks.js` to re-import content with proper `<p>` tag parsing
2. Created `migration/clean-artifacts.js` to remove header/footer artifacts
3. Created `migration/remove-ad-blocks.js` to strip advertisement content
4. Added CSS rules in `global.css` to force spacing between PortableText blocks
5. Restored "-Leo." signature where appropriate

**Files Modified**:
- `astro-frontend/src/styles/global.css` - Added paragraph spacing rules
- `migration/restore-with-breaks.js` - New import script
- `migration/clean-artifacts.js` - Cleanup script
- `migration/remove-ad-blocks.js` - Ad removal script

### UI/UX Improvements (Nov 24, 2025)
**Changes**:
1. **Favicon**: Fixed to use actual Tech & Business logo (PNG format)
2. **Header**: Removed redundant favicon icon, kept text-only logo
3. **Featured Articles**: Redesigned with cleaner layout, removed grey background
4. **Article Filters**: Simplified to Date and Read Time only (removed A-Z sorting)
5. **Bold Text**: Added CSS support for `<strong>` tags in articles
6. **Author Pages**: Created `/authors/[slug]` pages with bio and article list

**Files Modified**:
- `astro-frontend/src/layouts/BaseLayout.astro` - Favicon fix, header cleanup
- `astro-frontend/src/pages/index.astro` - Featured articles redesign
- `astro-frontend/src/pages/articles.astro` - Filter improvements, working JavaScript
- `astro-frontend/src/pages/authors/[slug].astro` - New author pages
- `astro-frontend/src/styles/global.css` - Bold text support
- `astro-frontend/public/favicon.png` - Updated logo file

### Article Detail Page Refinements (Nov 24, 2025)
**Changes**:
1. Added author profile picture to article header
2. Removed social share icons
3. Hid duplicate H1 tags in article body
4. Increased paragraph spacing (mb-10, mt-4)
5. Redesigned "Keep Reading" section with card-style links
6. Added white separator line above "Keep Reading"

**Files Modified**:
- `astro-frontend/src/pages/articles/[slug].astro`

### Data Migration (Nov 23-24, 2025)
**Completed**:
- ✅ Imported all articles from Beehiiv CSV export
- ✅ Created author documents for Leo, Pierce, Peter, Joey
- ✅ Assigned authors to articles
- ✅ Deleted 5 "Weekly Edition" articles
- ✅ Cleaned all content artifacts
- ✅ Restored paragraph breaks
- ✅ Removed advertisements

**Migration Scripts Created**:
- `beehiiv-to-sanity.js` - Initial import
- `create-authors.js` - Author setup
- `assign-authors.js` - Link articles to authors
- `delete-weekly.js` - Remove weekly editions
- `restore-with-breaks.js` - Re-import with formatting
- `clean-artifacts.js` - Remove unwanted content
- `remove-copyright.js` - Strip copyright blocks
- `remove-ad-blocks.js` - Remove ads
- `restore-deleted.js` - Restore accidentally deleted articles

## Current State

### Working Features
✅ Article listing page with filters (author, date, read time)
✅ Article detail pages with proper formatting
✅ Author profile pages
✅ "Keep Reading" related articles section
✅ Responsive layout
✅ Dark mode theme
✅ Proper favicon
✅ Bold text in articles
✅ Paragraph spacing
✅ Author attribution with photos

### Known Issues
⚠️ Filter/sort JavaScript needs testing with real user interaction
⚠️ Mobile responsiveness needs thorough testing
⚠️ No search functionality yet
⚠️ No email subscription system
⚠️ Not deployed to production

### In Progress
🔄 Adding modern gradient backgrounds
🔄 Improving "Keep Reading" to show author info
🔄 Testing all article content for formatting issues

### Next Priorities
1. Add gradient design elements (black/grey gradients)
2. Show author in "Keep Reading" section
3. Test and fix any remaining content formatting issues
4. Mobile responsiveness testing
5. Deploy to production (Vercel/Netlify)
6. Set up custom domain
7. Add email subscription form
8. Implement search functionality

## Environment Setup
- Node.js: v20+ (using nvm)
- Package manager: npm
- Dev servers running on:
  - Frontend: localhost:4321
  - Sanity Studio: localhost:3333

## Git Repository
- **URL**: https://github.com/LeoDuarte6/techandbusinessorg
- **Branch**: main
- **Last Push**: Nov 24, 2025 (initial commit with all changes)

## Sanity CMS
- **Project ID**: 5gz8vb6c
- **Dataset**: production
- **Studio URL**: localhost:3333 (local)
- **Content**:
  - ~25 articles (after cleanup)
  - 4 authors
  - 0 podcast episodes (schema exists)
  - 0 videos (schema exists)

## Important Notes for Future Development
1. **Don't re-import content** - All articles are clean now, avoid running migration scripts again
2. **Use CSS for spacing** - Don't try to fix spacing by re-importing, adjust CSS instead
3. **Test filters** - The JavaScript for article filtering was just fixed, needs real-world testing
4. **Author pages work** - Can link to authors from article cards now
5. **Favicon is PNG** - Don't try to use SVG, the logo is a PNG file
6. **Bold text works** - CSS rules are in place for `<strong>` tags
7. **Git credentials** - Token is saved, push should work now

## Files to Review First
When picking up work, review these files to understand current state:
1. `astro-frontend/src/pages/articles/[slug].astro` - Article detail page
2. `astro-frontend/src/pages/articles.astro` - Article listing with filters
3. `astro-frontend/src/styles/global.css` - All custom styles
4. `astro-frontend/src/layouts/BaseLayout.astro` - Main layout
5. This file (`.claude/recent-changes.md`) - Always check for latest updates
