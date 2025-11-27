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

const articlesToRestore = [
    'Business of Entertainment',
    'Playing It Safe on LinkedIn Is Costing You Opportunities',
    'Business Automations',
    'The Coming Shift in Investment Banking: Culture, AI, and the Junior Analyst Dilemma',
    'Collusion and Predatory Pricing in the Airline Industry'
];

function cleanHtml(html) {
    if (!html) return [];

    let clean = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    clean = clean.replace(/<!DOCTYPE[^>]*>/gi, '');
    clean = clean.replace(/<html[^>]*>/gi, '');
    clean = clean.replace(/<head>[\s\S]*?<\/head>/gi, '');
    clean = clean.replace(/<body[^>]*>/gi, '');
    clean = clean.replace(/<\/body>/gi, '');
    clean = clean.replace(/<\/html>/gi, '');

    const blocks = [];
    const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;

    while ((match = paragraphRegex.exec(clean)) !== null) {
        let text = match[1];

        text = text
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();

        if (!text) continue;

        // Skip advertisement blocks
        const lowerText = text.toLowerCase();
        if (lowerText.includes('in partnership with') ||
            lowerText.includes('long angle is a private') ||
            lowerText.includes('apply to join') ||
            lowerText.includes('no membership fees')) {
            continue;
        }

        blocks.push({
            _type: 'block',
            style: 'normal',
            children: [{
                _type: 'span',
                text: text,
                marks: []
            }]
        });
    }

    return blocks;
}

function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function estimateReadTime(blocks) {
    const wordsPerMinute = 200;
    const wordCount = blocks.reduce((count, block) => {
        if (block.children) {
            const text = block.children.map(c => c.text).join(' ');
            return count + text.split(/\s+/).length;
        }
        return count;
    }, 0);
    return Math.ceil(wordCount / wordsPerMinute);
}

async function restoreDeletedArticles() {
    if (!fs.existsSync(csvFilePath)) {
        console.error('CSV file not found');
        return;
    }

    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
    });

    console.log(`Restoring ${articlesToRestore.length} deleted articles...`);

    for (const title of articlesToRestore) {
        const record = records.find(r => r.web_title === title);

        if (!record) {
            console.log(`Could not find in CSV: ${title}`);
            continue;
        }

        const body = cleanHtml(record.content_html);

        const article = {
            _type: 'post',
            title: record.web_title,
            slug: {
                _type: 'slug',
                current: createSlug(record.web_title),
            },
            publishedAt: record.created_at || new Date().toISOString(),
            excerpt: record.web_subtitle || '',
            body: body,
            readTime: estimateReadTime(body),
        };

        try {
            await client.create(article);
            console.log(`Restored: ${title}`);
        } catch (err) {
            console.error(`Failed to restore ${title}:`, err.message);
        }
    }
}

restoreDeletedArticles();
