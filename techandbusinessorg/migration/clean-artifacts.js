import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '5gz8vb6c',
    dataset: 'production',
    apiVersion: '2024-03-19',
    token: "skShNGhivYVcjKnerWUYrZieYijHT8wgVNOHCaQItKNYlfzMqDb8v4CbTThlRi6ZUXXgBEdirVeqyje8BwlDCpLWqI8yZ1gJ29yeuzjSPGOTcmIMk7FouJvVuvg7mEjc0eLmtt1Bas3IlX40otHhyhlcpysap4dcwHcSLAx975u78NzOuLOf",
    useCdn: false,
});

async function cleanArtifacts() {
    const posts = await client.fetch(`*[_type == "post"]`);
    console.log(`Checking ${posts.length} posts for artifacts...`);

    for (const post of posts) {
        if (!post.body || !Array.isArray(post.body)) continue;

        let newBody = [...post.body];
        let needsUpdate = false;

        // 1. Clean Header Artifacts (Title, Date, "Read Online")
        // Check first 3 blocks
        const initialLength = newBody.length;

        // Filter out blocks that look like the title or date/meta info
        newBody = newBody.filter((block, index) => {
            // Only check the first 5 blocks for header stuff to be safe
            if (index > 4) return true;

            if (block._type === 'block' && block.children) {
                const text = block.children.map(c => c.text).join('').trim();

                // Remove if it matches the title exactly (or close to it)
                if (block.style === 'h1' || text.toLowerCase() === post.title.toLowerCase()) {
                    console.log(`Removing title block from: ${post.title}`);
                    needsUpdate = true;
                    return false;
                }

                // Remove date/read online lines
                if (text.includes('Read Online') || text.match(/^[A-Za-z]+ \d{1,2}, \d{4}/)) {
                    console.log(`Removing meta block from: ${post.title}`);
                    needsUpdate = true;
                    return false;
                }
            }
            return true;
        });

        // 2. Clean Footer Artifacts (Address, Copyright)
        // Re-filter the array (which might have shrunk)
        newBody = newBody.filter(block => {
            if (block._type === 'block' && block.children) {
                const text = block.children.map(c => c.text).join('').toLowerCase();

                if (text.includes('228 park ave') ||
                    text.includes('new york, new york') ||
                    text.includes('© 2025 techandbusiness.org') ||
                    text.includes('unsubscribe') ||
                    text.includes('update your email preferences')) {
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
                console.log(`Cleaned artifacts for: ${post.title}`);
            } catch (err) {
                console.error(`Failed to update ${post.title}:`, err.message);
            }
        }
    }
    console.log("Artifact cleaning complete.");
}

cleanArtifacts();
