import { createClient } from '@sanity/client';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const client = createClient({
    projectId: '5gz8vb6c',
    dataset: 'production',
    apiVersion: '2024-03-19',
    token: "skShNGhivYVcjKnerWUYrZieYijHT8wgVNOHCaQItKNYlfzMqDb8v4CbTThlRi6ZUXXgBEdirVeqyje8BwlDCpLWqI8yZ1gJ29yeuzjSPGOTcmIMk7FouJvVuvg7mEjc0eLmtt1Bas3IlX40otHhyhlcpysap4dcwHcSLAx975u78NzOuLOf",
    useCdn: false,
});

const csvFilePath = './migration/beehiiv-export.csv';

function cleanHtml(html) {
    if (!html) return [];

    // 1. Remove style blocks completely (content and tags)
    let clean = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // 2. Remove other head/meta tags if present
    clean = clean.replace(/<!DOCTYPE[^>]*>/gi, '');
    clean = clean.replace(/<html[^>]*>/gi, '');
    clean = clean.replace(/<head>[\s\S]*?<\/head>/gi, '');
    clean = clean.replace(/<body[^>]*>/gi, '');
    clean = clean.replace(/<\/body>/gi, '');
    clean = clean.replace(/<\/html>/gi, '');

    // 3. Simple parser to convert basic HTML to Portable Text blocks
    // We'll split by block-level tags to create separate blocks.
    // This is a simplified parser. For full fidelity, we'd need a DOM parser.

    const blocks = [];

    // Split content by paragraphs, headings, etc.
    // We'll use a regex to find tags and their content.
    // Matches: <tag>content</tag>
    const tagRegex = /<(p|h[1-6]|ul|ol|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi;

    let match;
    let lastIndex = 0;

    // If no tags found, treat as one paragraph (after stripping tags)
    if (!clean.match(tagRegex)) {
        const text = clean.replace(/<[^>]*>/g, '').trim();
        if (text) {
            blocks.push({
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: text }]
            });
        }
        return blocks;
    }

    while ((match = tagRegex.exec(clean)) !== null) {
        const tag = match[1].toLowerCase();
        const content = match[2];

        // Strip inner tags for now (bold/italic) to keep it simple, or handle them if possible.
        // For now, let's just decode entities and strip tags for the text content.
        let text = content
            .replace(/<[^>]*>/g, '') // Strip inner tags
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();

        if (!text) continue;

        let style = 'normal';
        if (tag.startsWith('h')) style = tag;
        if (tag === 'blockquote') style = 'blockquote';

        blocks.push({
            _type: 'block',
            style: style,
            children: [{
                _type: 'span',
                text: text,
                marks: [] // We lose bold/italic here but we get the content back.
            }]
        });
    }

    return blocks;
}

async function restoreContent() {
    if (!fs.existsSync(csvFilePath)) {
        console.error('CSV file not found');
        return;
    }

    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
    });

    console.log(`Found ${records.length} records in CSV.`);

    for (const record of records) {
        // Find the post in Sanity
        // We match by title (slug might have changed, but title should be close)
        // Or we can try to find by slug derived from title.

        // Let's try to find "Passions (Rerelease)" specifically first to test.
        // Or just run for all. Let's run for all but log carefully.

        const title = record.web_title;
        if (!title) continue;

        const posts = await client.fetch(`*[_type == "post" && title == $title]`, { title });

        if (posts.length === 0) {
            console.log(`Post not found in Sanity: ${title}`);
            continue;
        }

        const post = posts[0];

        // Generate new body
        const newBody = cleanHtml(record.content_html);

        if (newBody.length > 0) {
            try {
                await client.patch(post._id).set({ body: newBody }).commit();
                console.log(`Restored content for: ${title}`);
            } catch (err) {
                console.error(`Failed to update ${title}:`, err.message);
            }
        } else {
            console.log(`No content extracted for: ${title}`);
        }
    }
}

restoreContent();
