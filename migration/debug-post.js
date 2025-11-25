import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '5gz8vb6c',
    dataset: 'production',
    apiVersion: '2024-03-19',
    token: "skShNGhivYVcjKnerWUYrZieYijHT8wgVNOHCaQItKNYlfzMqDb8v4CbTThlRi6ZUXXgBEdirVeqyje8BwlDCpLWqI8yZ1gJ29yeuzjSPGOTcmIMk7FouJvVuvg7mEjc0eLmtt1Bas3IlX40otHhyhlcpysap4dcwHcSLAx975u78NzOuLOf",
    useCdn: false,
});

async function debugPost() {
    // Fetch the specific post by title or slug part
    const posts = await client.fetch(`*[_type == "post" && title match "Everything is sales"]`);

    if (posts.length === 0) {
        console.log("Post not found");
        return;
    }

    const post = posts[0];
    console.log("Title:", post.title);
    console.log("Excerpt:", post.excerpt);
    console.log("Body Type:", typeof post.body);
    console.log("Body Is Array:", Array.isArray(post.body));
    console.log("Body Content:", JSON.stringify(post.body, null, 2));
}

debugPost();
