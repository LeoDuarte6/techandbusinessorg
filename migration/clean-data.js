import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '5gz8vb6c',
    dataset: 'production',
    apiVersion: '2024-03-19',
    token: "skShNGhivYVcjKnerWUYrZieYijHT8wgVNOHCaQItKNYlfzMqDb8v4CbTThlRi6ZUXXgBEdirVeqyje8BwlDCpLWqI8yZ1gJ29yeuzjSPGOTcmIMk7FouJvVuvg7mEjc0eLmtt1Bas3IlX40otHhyhlcpysap4dcwHcSLAx975u78NzOuLOf",
    useCdn: false,
});

async function cleanPosts() {
    const posts = await client.fetch(`*[_type == "post"]`);
    console.log(`Found ${posts.length} posts to check.`);

    for (const post of posts) {
        let updates = {};
        let needsUpdate = false;

        // 1. Clean Excerpt
        if (post.excerpt && (typeof post.excerpt === 'string') && (post.excerpt.includes(':root {') || post.excerpt.includes('color-scheme:') || post.excerpt.includes('<!DOCTYPE html>'))) {
            console.log(`Cleaning excerpt for: ${post.title}`);
            updates.excerpt = ""; // Clear garbage excerpt
            needsUpdate = true;
        }

        // 2. Clean Body (Portable Text)
        if (post.body && Array.isArray(post.body)) {
            const newBody = post.body.filter(block => {
                if (block._type === 'block' && block.children) {
                    const text = block.children.map(c => c.text).join('');
                    // Check if this block looks like the CSS garbage
                    if (text.includes(':root {') || text.includes('color-scheme:') || text.includes('body { margin: 0;')) {
                        console.log(`Removing garbage block from body of: ${post.title}`);
                        needsUpdate = true;
                        return false; // Remove this block
                    }
                }
                return true; // Keep other blocks
            });

            if (needsUpdate) {
                updates.body = newBody;
            }
        }

        if (needsUpdate) {
            try {
                await client.patch(post._id).set(updates).commit();
                console.log(`Successfully updated ${post.title}`);
            } catch (err) {
                console.error(`Failed to update ${post.title}:`, err.message);
            }
        }
    }
    console.log("Cleaning complete.");
}

cleanPosts();
