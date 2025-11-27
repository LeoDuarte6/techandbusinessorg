# Beehiiv to Sanity Migration

## Prerequisites

1. Export your posts from Beehiiv:
   - Go to Beehiiv Settings → Export
   - Click "Export Posts"
   - Download the CSV file

2. Create a Sanity API token:
   - Go to https://sanity.io/manage
   - Select your "Tech & Business" project
   - Go to API → Tokens
   - Click "Add API token"
   - Name it "Migration Script"
   - Set permissions to "Editor"
   - Copy the token

## Setup

```bash
cd migration
npm install
```

## Configuration

Create a `.env` file in the `migration` directory:

```
SANITY_PROJECT_ID=your-project-id-here
SANITY_TOKEN=your-api-token-here
```

## Running the Migration

1. Place your Beehiiv CSV export in this directory as `beehiiv-export.csv`

2. Run the migration:
```bash
npm run migrate
```

3. Check the output for any errors

4. Verify in Sanity Studio that articles were imported correctly

## What Gets Imported

- ✅ Article title
- ✅ Publication date
- ✅ Content/body
- ✅ Excerpt (if available)
- ✅ Auto-generated slug
- ✅ Estimated read time

## What Needs Manual Work

- ❌ Featured images (add these manually in Sanity Studio)
- ❌ Author assignment (assign authors in Sanity Studio)
- ❌ Rich text formatting (the script imports as plain text)

## Troubleshooting

**"beehiiv-export.csv not found"**: Make sure the CSV file is in the `migration/` directory

**"Invalid credentials"**: Check that your `.env` file has the correct project ID and API token

**"Failed to import"**: Check the error message - it might be a formatting issue in the CSV

## After Migration

1. Go to Sanity Studio
2. Review imported articles
3. Add featured images
4. Assign authors
5. Format any special content (code blocks, quotes, etc.)
6. Publish!
