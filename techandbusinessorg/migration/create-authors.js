#!/usr/bin/env node

/**
 * Create Authors in Sanity
 */

import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '5gz8vb6c',
    dataset: 'production',
    useCdn: false,
    token: 'skShNGhivYVcjKnerWUYrZieYijHT8wgVNOHCaQItKNYlfzMqDb8v4CbTThlRi6ZUXXgBEdirVeqyje8BwlDCpLWqI8yZ1gJ29yeuzjSPGOTcmIMk7FouJvVuvg7mEjc0eLmtt1Bas3IlX40otHhyhlcpysap4dcwHcSLAx975u78NzOuLOf',
    apiVersion: '2024-11-24',
});

const authors = [
    {
        _type: 'author',
        name: 'Leo Duarte',
        slug: { _type: 'slug', current: 'leo-duarte' },
        role: 'Infrastructure & Design Lead',
        bio: 'Technical lead and entrepreneur focused on building systems and infrastructure. Responsible for the platform architecture and design.',
    },
    {
        _type: 'author',
        name: 'Pierce Berke',
        slug: { _type: 'slug', current: 'pierce-berke' },
        role: 'Co-Host & Content Creator',
        bio: 'Amherst student and podcast co-host. Brings insights on technology trends and student perspectives.',
    },
    {
        _type: 'author',
        name: 'Joey Summa',
        slug: { _type: 'slug', current: 'joey-summa' },
        role: 'Founding Staff & Finance',
        bio: 'Syracuse student specializing in financial analysis and market commentary. Content creator focused on business fundamentals.',
    },
    {
        _type: 'author',
        name: 'Peter Monti',
        slug: { _type: 'slug', current: 'peter-monti' },
        role: 'Contributing Writer',
        bio: 'Contributing writer covering technology, business, and innovation.',
    },
];

async function createAuthors() {
    console.log('📝 Creating authors in Sanity...\n');

    for (const author of authors) {
        try {
            const result = await client.create(author);
            console.log(`✅ Created: ${author.name} (${author.role})`);
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log(`⏭️  Already exists: ${author.name}`);
            } else {
                console.error(`❌ Failed to create ${author.name}: ${error.message}`);
            }
        }
    }

    console.log('\n🎉 Authors setup complete!');
}

createAuthors().catch((error) => {
    console.error('❌ Failed to create authors:', error);
    process.exit(1);
});
