import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '5gz8vb6c',
    dataset: 'production',
    apiVersion: '2024-03-19',
    token: "skShNGhivYVcjKnerWUYrZieYijHT8wgVNOHCaQItKNYlfzMqDb8v4CbTThlRi6ZUXXgBEdirVeqyje8BwlDCpLWqI8yZ1gJ29yeuzjSPGOTcmIMk7FouJvVuvg7mEjc0eLmtt1Bas3IlX40otHhyhlcpysap4dcwHcSLAx975u78NzOuLOf",
    useCdn: false,
});

async function cleanFooters() {
    const posts = await client.fetch(`*[_type == "post"]`);
    console.log(`Checking ${posts.length} posts for footer artifacts...`);

    for (const post of posts) {
        if (!post.body || !Array.isArray(post.body)) continue;

        let needsUpdate = false;
        const newBody = post.body.filter(block => {
            if (block._type === 'block' && block.children) {
                const text = block.children.map(c => c.text).join('').toLowerCase();

                // Check for common email footer text
                if (text.includes('update your email preferences') ||
                    text.includes('unsubscribe') ||
                    text.includes('view in browser') ||
                    text.includes('tech & business organization') && text.includes('new york')) {
                    console.log(`Removing footer block from: ${post.title}`);
                    needsUpdate = true;
                    return false;
                }
            }
            return true;
        });

        if (needsUpdate) {
            try {
                await client.patch(post._id).set({ body: newBody }).commit();
                console.log(`Cleaned footer for: ${post.title}`);
            } catch (err) {
                console.error(`Failed to update ${post.title}:`, err.message);
            }
        }
    }
    console.log("Footer cleaning complete.");
}

cleanFooters();
