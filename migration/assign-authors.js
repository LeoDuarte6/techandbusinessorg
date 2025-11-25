#!/usr/bin/env node

/**
 * Assign authors to articles based on content
 */

import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '5gz8vb6c',
    dataset: 'production',
    useCdn: false,
    token: 'skShNGhivYVcjKnerWUYrZieYijHT8wgVNOHCaQItKNYlfzMqDb8v4CbTThlRi6ZUXXgBEdirVeqyje8BwlDCpLWqI8yZ1gJ29yeuzjSPGOTcmIMk7FouJvVuvg7mEjc0eLmtt1Bas3IlX40otHhyhlcpysap4dcwHcSLAx975u78NzOuLOf',
    apiVersion: '2024-11-24',
});

async function assignAuthors() {
    console.log('👥 Assigning authors to articles...\n');

    // Fetch all authors
    const authors = await client.fetch('*[_type == "author"]');
    const authorMap = {};
    authors.forEach(author => {
        authorMap[author.name.toLowerCase()] = author._id;
    });

    console.log(`Found ${authors.length} authors:\n`);
    authors.forEach(a => console.log(`  - ${a.name}`));
    console.log();

    // Fetch all posts without authors
    const posts = await client.fetch('*[_type == "post"]');

    console.log(`Checking ${posts.length} posts...\n`);

    let updatedCount = 0;

    for (const post of posts) {
        try {
            let assignedAuthor = null;

            // Check title and body for author mentions
            const content = (post.title + ' ' + JSON.stringify(post.body)).toLowerCase();

            if (content.includes('leo') || content.includes('duarte')) {
                assignedAuthor = authorMap['leo duarte'];
            } else if (content.includes('pierce') || content.includes('berke')) {
                assignedAuthor = authorMap['pierce berke'];
            } else if (content.includes('joey') || content.includes('summa')) {
                assignedAuthor = authorMap['joey summa'];
            } else if (content.includes('peter') || content.includes('monti')) {
                assignedAuthor = authorMap['peter monti'];
            } else {
                // Default to Leo for general articles
                assignedAuthor = authorMap['leo duarte'];
            }

            if (assignedAuthor && !post.author) {
                await client
                    .patch(post._id)
                    .set({
                        author: {
                            _type: 'reference',
                            _ref: assignedAuthor
                        }
                    })
                    .commit();

                const authorName = authors.find(a => a._id === assignedAuthor)?.name;
                console.log(`✅ ${post.title} → ${authorName}`);
                updatedCount++;
            } else if (post.author) {
                console.log(`⏭️  ${post.title} (already has author)`);
            }
        } catch (error) {
            console.error(`❌ Failed to assign author to ${post.title}: ${error.message}`);
        }
    }

    console.log(`\n📊 Updated ${updatedCount} articles with authors`);
    console.log('🎉 Author assignment complete!');
}

assignAuthors().catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
});
