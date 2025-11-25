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

    // 1. Remove style blocks completely
    let clean = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // 2. Remove other head/meta tags
    clean = clean.replace(/<!DOCTYPE[^>]*>/gi, '');
    clean = clean.replace(/<html[^>]*>/gi, '');
    clean = clean.replace(/<head>[\s\S]*?<\/head>/gi, '');
    clean = clean.replace(/<body[^>]*>/gi, '');
    clean = clean.replace(/<\/body>/gi, '');
    clean = clean.replace(/<\/html>/gi, '');

    const blocks = [];

    // Split by <p> tags to preserve paragraph breaks
    const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;

    while ((match = paragraphRegex.exec(clean)) !== null) {
        let text = match[1];

        // Strip inner tags and decode entities
        text = text
            .replace(/<br\s*\/?>/gi, '\n') // Preserve line breaks within paragraphs
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();

        if (!text) continue;

        // Check if this looks like a heading
        let style = 'normal';
        if (text.length < 100 && (text.endsWith(':') || text.endsWith('?') || /^[A-Z][^.!?]*$/.test(text))) {
            // Might be a heading, but let's be conservative
            style = 'normal';
        }

        blocks.push({
            _type: 'block',
            style: style,
            children: [{
                _type: 'span',
                text: text,
                marks: []
            }]
        });
    }

    // If no paragraphs found, try splitting by double line breaks
    if (blocks.length === 0) {
        const text = clean.replace(/<[^>]*>/g, '').trim();
        const paragraphs = text.split(/\n\n+/);

        paragraphs.forEach(para => {
            const cleaned = para.trim();
            if (cleaned) {
                blocks.push({
                    _type: 'block',
                    style: 'normal',
                    children: [{
                        _type: 'span',
                        text: cleaned,
                        marks: []
                    }]
                });
            }
        });
    }

    return blocks;
}

async function restoreContentWithBreaks() {
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
        const title = record.web_title;
        if (!title) continue;

        const posts = await client.fetch(`*[_type == "post" && title == $title]`, { title });

        if (posts.length === 0) {
            console.log(`Post not found in Sanity: ${title}`);
            continue;
        }

        const post = posts[0];
        const newBody = cleanHtml(record.content_html);

        // Add signature back for Leo's articles
        if (title.includes('sales') || title.includes('Passions') || title.includes('Journey')) {
            newBody.push({
                _type: 'block',
                style: 'normal',
                children: [{
                    _type: 'span',
                    text: '-Leo.',
                    marks: []
                }]
            });
        }

        if (newBody.length > 0) {
            try {
                await client.patch(post._id).set({ body: newBody }).commit();
                console.log(`Restored content with proper breaks for: ${title}`);
            } catch (err) {
                console.error(`Failed to update ${title}:`, err.message);
            }
        }
    }
}

restoreContentWithBreaks();
