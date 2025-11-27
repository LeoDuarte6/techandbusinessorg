#!/usr/bin/env node

/**
 * Beehiiv to Sanity Migration Script
 * 
 * This script imports articles from a Beehiiv CSV export into Sanity CMS.
 * 
 * Usage:
 * 1. Export your posts from Beehiiv (Settings → Export → Posts as CSV)
 * 2. Place the CSV file in this directory as 'beehiiv-export.csv'
 * 3. Run: npm run migrate
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

// Sanity client configuration
const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID || 'your-project-id',
    dataset: 'production',
    useCdn: false,
    token: process.env.SANITY_TOKEN, // You'll need to create an API token
    apiVersion: '2024-11-24',
});

// Read and parse CSV
const csvFilePath = './beehiiv-export.csv';

if (!fs.existsSync(csvFilePath)) {
    console.error('❌ Error: beehiiv-export.csv not found!');
    console.log('Please export your posts from Beehiiv and place the CSV file here.');
    process.exit(1);
}

const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
});

console.log(`📊 Found ${records.length} articles to import\n`);

// Helper function to create slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Helper function to strip HTML tags and get plain text
function stripHtml(html) {
    if (!html) return '';

    // Remove HTML tags
    let text = html.replace(/<[^>]*>/g, ' ');

    // Decode HTML entities
    text = text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();

    return text;
}

// Helper function to estimate read time
function estimateReadTime(content) {
    const wordsPerMinute = 200;
    const plainText = stripHtml(content);
    const wordCount = plainText.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

// Helper function to create excerpt from content
function createExcerpt(html, maxLength = 160) {
    const plainText = stripHtml(html);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
}

// Import articles
async function importArticles() {
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const record of records) {
        try {
            // Skip if not confirmed/published
            if (record.status !== 'confirmed') {
                console.log(`⏭️  Skipped (not published): ${record.web_title}`);
                skippedCount++;
                continue;
            }

            const plainTextContent = stripHtml(record.content_html || '');

            const article = {
                _type: 'post',
                title: record.web_title || 'Untitled',
                slug: {
                    _type: 'slug',
                    current: createSlug(record.web_title || 'untitled'),
                },
                publishedAt: record.created_at || new Date().toISOString(),
                excerpt: record.web_subtitle || createExcerpt(record.content_html),
                body: [
                    {
                        _type: 'block',
                        style: 'normal',
                        children: [
                            {
                                _type: 'span',
                                text: plainTextContent,
                                marks: [],
                            },
                        ],
                    },
                ],
                readTime: estimateReadTime(record.content_html || ''),
            };

            // Add thumbnail if available
            if (record.thumbnail_url) {
                // Note: This just stores the URL. You'll need to manually upload images to Sanity
                console.log(`   📸 Thumbnail URL: ${record.thumbnail_url}`);
            }

            // Create the document in Sanity
            const result = await client.create(article);
            console.log(`✅ Imported: ${article.title} (${article.readTime} min read)`);
            successCount++;
        } catch (error) {
            console.error(`❌ Failed to import: ${record.web_title || 'Unknown'}`);
            console.error(`   Error: ${error.message}`);
            errorCount++;
        }
    }

    console.log(`\n📈 Import Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📊 Total: ${records.length}`);

    if (successCount > 0) {
        console.log(`\n🎉 Migration complete! Check Sanity Studio to review your articles.`);
        console.log(`\n⚠️  Note: Featured images need to be added manually in Sanity Studio.`);
        console.log(`   You can find the original thumbnail URLs in the logs above.`);
    }
}

// Run the import
importArticles().catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
});
