# Coding Guidelines for Tech & Business

## General Principles
1. **No Placeholders**: Always use real content or generate actual assets
2. **Premium Quality**: Every feature should feel polished and professional
3. **Consistency**: Follow established patterns in the codebase
4. **Performance**: Optimize images, minimize bundle size
5. **Accessibility**: Semantic HTML, proper ARIA labels

## File Organization
- **Components**: Small, reusable, single-purpose
- **Pages**: Route-level components, fetch data here
- **Layouts**: Shared page structure
- **Styles**: Global styles in `global.css`, component styles inline with Tailwind

## Styling Conventions
### Tailwind CSS
- Use Tailwind utility classes for most styling
- Use CSS variables for theme colors: `text-[var(--theme-text)]`
- Responsive: mobile-first approach (`md:`, `lg:` breakpoints)

### Custom CSS
- Only use custom CSS for complex animations or global styles
- Keep in `global.css` with clear comments
- Use `!important` sparingly, only when overriding library defaults

### Design Patterns
```astro
<!-- Good: Consistent spacing, theme variables -->
<div class="section-padding">
  <h2 class="text-4xl font-bold text-[var(--theme-text)] mb-8">
    Section Title
  </h2>
</div>

<!-- Bad: Hardcoded colors, inconsistent spacing -->
<div class="py-10">
  <h2 class="text-3xl font-extrabold text-white mb-6">
    Section Title
  </h2>
</div>
```

## Component Patterns
### Article Card
```astro
<article class="group">
  <a href={`/articles/${slug}`}>
    <img /> <!-- Hover scale effect -->
    <h3 class="group-hover:text-[var(--theme-gray)]">Title</h3>
    <p class="text-[var(--theme-gray)]">Excerpt</p>
    <div class="text-sm">Author • Date • Read time</div>
  </a>
</article>
```

### Page Layout
```astro
<BaseLayout title="Page Title">
  <section class="section-padding">
    <div class="container-custom">
      <!-- Content -->
    </div>
  </section>
</BaseLayout>
```

## Data Fetching
### Sanity Queries
```typescript
// Always include necessary fields
const query = `*[_type == "post"] | order(publishedAt desc) {
  title,
  slug,
  publishedAt,
  excerpt,
  "author": author->{name, slug, headshot},
  readTime
}`;

const posts = await sanityClient.fetch(query);
```

### Image Optimization
```astro
<!-- Use Sanity's image CDN with parameters -->
<img 
  src={`${imageUrl}?w=600&h=400&fit=crop`}
  alt={title}
/>
```

## Common Utilities
### CSS Classes
- `section-padding`: Consistent vertical padding for sections
- `container-custom`: Max-width container with padding
- `prose`: Typography styles for article content

### Spacing Scale
- Small: `mb-4` (1rem)
- Medium: `mb-8` (2rem)
- Large: `mb-12` (3rem)
- Section: `section-padding` (custom)

## Astro-Specific
### Static Paths
```astro
export async function getStaticPaths() {
  const items = await sanityClient.fetch(`...`);
  return items.map(item => ({
    params: { slug: item.slug.current },
    props: { item }
  }));
}
```

### Client-Side Scripts
```astro
<script>
  // Runs on every page load
  const element = document.getElementById('...');
</script>

<script is:inline>
  // Runs inline, not bundled
</script>

<script define:vars={{ data }}>
  // Access server data in client script
</script>
```

## Don't Do This
❌ Generate placeholder images - use `generate_image` tool
❌ Use generic colors (plain red, blue) - use theme variables
❌ Hardcode content - fetch from Sanity
❌ Ignore mobile responsiveness
❌ Create massive components - break into smaller pieces
❌ Use inline styles - use Tailwind classes
❌ Forget alt text on images
❌ Use `any` type in TypeScript

## Do This
✅ Use semantic HTML (`<article>`, `<section>`, `<nav>`)
✅ Add loading states for dynamic content
✅ Optimize images with Sanity CDN parameters
✅ Use TypeScript for type safety
✅ Add hover states for interactive elements
✅ Test in both light and dark mode
✅ Keep components under 200 lines
✅ Add comments for complex logic

## Performance Checklist
- [ ] Images optimized and lazy-loaded
- [ ] Minimal JavaScript bundle size
- [ ] CSS purged of unused classes
- [ ] Fonts preloaded
- [ ] Critical CSS inlined
- [ ] Static generation for all routes

## Accessibility Checklist
- [ ] Semantic HTML structure
- [ ] Alt text on all images
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader tested
- [ ] ARIA labels where needed

## Git Workflow
1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push to GitHub: `git push origin feature/name`
4. Create pull request
5. Merge to main after review

## Commit Message Format
```
feat: add author filter to articles page
fix: correct favicon path in BaseLayout
style: improve spacing in article cards
refactor: extract ArticleCard component
docs: update README with deployment steps
```
