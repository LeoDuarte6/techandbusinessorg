import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '5gz8vb6c',
    dataset: 'production',
    apiVersion: '2024-03-19',
    token: "skShNGhivYVcjKnerWUYrZieYijHT8wgVNOHCaQItKNYlfzMqDb8v4CbTThlRi6ZUXXgBEdirVeqyje8BwlDCpLWqI8yZ1gJ29yeuzjSPGOTcmIMk7FouJvVuvg7mEjc0eLmtt1Bas3IlX40otHhyhlcpysap4dcwHcSLAx975u78NzOuLOf",
    useCdn: false,
});

async function deleteWeeklyEditions() {
    // Find posts with "Edition" in the title
    const posts = await client.fetch(`*[_type == "post" && title match "Edition"]`);
    console.log(`Found ${posts.length} weekly edition posts to delete.`);

    for (const post of posts) {
        try {
            await client.delete(post._id);
            console.log(`Deleted: ${post.title}`);
        } catch (err) {
            console.error(`Failed to delete ${post.title}:`, err.message);
        }
    }
}

deleteWeeklyEditions();
