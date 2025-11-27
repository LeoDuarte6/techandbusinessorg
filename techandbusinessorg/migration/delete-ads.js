import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '5gz8vb6c',
    dataset: 'production',
    apiVersion: '2024-03-19',
    token: "skShNGhivYVcjKnerWUYrZieYijHT8wgVNOHCaQItKNYlfzMqDb8v4CbTThlRi6ZUXXgBEdirVeqyje8BwlDCpLWqI8yZ1gJ29yeuzjSPGOTcmIMk7FouJvVuvg7mEjc0eLmtt1Bas3IlX40otHhyhlcpysap4dcwHcSLAx975u78NzOuLOf",
    useCdn: false,
});

async function deleteAdvertisementArticles() {
    // Find posts that contain advertisement content
    const posts = await client.fetch(`*[_type == "post"]`);
    console.log(`Checking ${posts.length} posts for advertisements...`);

    for (const post of posts) {
        if (!post.body || !Array.isArray(post.body)) continue;

        // Check if any block contains advertisement text
        const hasAd = post.body.some(block => {
            if (block._type === 'block' && block.children) {
                const text = block.children.map(c => c.text).join('').toLowerCase();
                return text.includes('in partnership with') ||
                    text.includes('long angle') ||
                    text.includes('apply to join') ||
                    text.includes('no membership fees');
            }
            return false;
        });

        if (hasAd) {
            try {
                await client.delete(post._id);
                console.log(`Deleted advertisement article: ${post.title}`);
            } catch (err) {
                console.error(`Failed to delete ${post.title}:`, err.message);
            }
        }
    }
    console.log("Advertisement removal complete.");
}

deleteAdvertisementArticles();
