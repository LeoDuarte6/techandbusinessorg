#!/usr/bin/env node

/**
 * Fix missing keys in Sanity articles
 */

import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '5gz8vb6c',
    dataset: 'production',
    useCdn: false,
    token: 'skShNGhivYVcjKnerWUYrZieYijHT8wgVNOHCaQItKNYlfzMqDb8v4CbTThlRi6ZUXXgBEdirVeqyje8BwlDCpLWqI8yZ1gJ29yeuzjSPGOTcmIMk7FouJvVuvg7mEjc0eLmtt1Bas3IlX40otHhyhlcpysap4dcwHcSLAx975u78NzOuLOf',
    apiVersion: '2024-11-24',
});

async function fixMissingKeys() {
    console.log('🔧 Fixing missing keys in articles...\n');

    // Fetch all posts
    const posts = await client.fetch('*[_type == "post"]');

    console.log(`Found ${posts.length} posts to check\n`);

    for (const post of posts) {
        try {
            // Check if body blocks have keys
            if (post.body && Array.isArray(post.body)) {
                const updatedBody = post.body.map((block, index) => {
                    if (!block._key) {
                        return {
                            ...block,
                            _key: `block-${Date.now()}-${index}`,
                        };
                    }
                    return block;
                });

                // Update the post with fixed body
                await client
                    .patch(post._id)
                    .set({ body: updatedBody })
                    .commit();

                console.log(`✅ Fixed keys for: ${post.title}`);
            }
        } catch (error) {
            console.error(`❌ Failed to fix ${post.title}: ${error.message}`);
        }
    }

    console.log('\n🎉 All keys fixed!');
}

fixMissingKeys().catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
});
