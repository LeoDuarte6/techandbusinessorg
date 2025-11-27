#!/usr/bin/env node

/**
 * Fix authors based on Beehiiv data
 */

import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '5gz8vb6c',
    dataset: 'production',
    useCdn: false,
    token: 'skShNGhivYVcjKnerWUYrZieYijHT8wgVNOHCaQItKNYlfzMqDb8v4CbTThlRi6ZUXXgBEdirVeqyje8BwlDCpLWqI8yZ1gJ29yeuzjSPGOTcmIMk7FouJvVuvg7mEjc0eLmtt1Bas3IlX40otHhyhlcpysap4dcwHcSLAx975u78NzOuLOf',
    apiVersion: '2024-11-24',
});

// Correct author mapping from Beehiiv
const authorMapping = {
    "America's Next Lithium Mine": "Peter Monti",
    "How does it feel to establish a newsletter?": "Leo Duarte",
    "Wealth Management: A Rising Opportunity for the Next Generation of Finance Professionals": "Joey Summa",
    "Business of Entertainment": "Leo Duarte",
    "Playing It Safe on LinkedIn Is Costing You Opportunities": "Joey Summa",
    "IBM-RedHat Acquisition, A significant Pivot": "Pierce Berke",
    "Net Neutrality at an Economic Glance": "Pierce Berke",
    "Techandbusiness.org 8/18/25 Edition": "Leo Duarte",
    "Techandbusiness.org 8/11/25 Edition": "Leo Duarte",
    "Techandbusiness.org 8/4/25 Edition": "Leo Duarte",
    "Techandbusiness.org 7/28/2025 Edition": "Leo Duarte",
    "Techandbusiness.org 7/21/2025 Edition": "Leo Duarte",
    "Business Automations": "Leo Duarte",
    "Alibaba Equity Report": "Joey Summa",
    "The Coming Shift in Investment Banking: Culture, AI, and the Junior Analyst Dilemma": "Joey Summa",
    "Quantum Computing's Next Short": "Pierce Berke",
    "The One AI Prompt Every Finance Student Should Know": "Joey Summa",
    "\"President\" Leo Duarte Interview": "Leo Duarte",
    "Becoming AI First": "Leo Duarte",
    "Collusion and Predatory Pricing in the Airline Industry": "Pierce Berke",
    "COVID-Era NYC Rent Crisis": "Pierce Berke",
    "Quantum Computing's Next Flop": "Pierce Berke",
    "Principal-Agent Problem: Incentive Misalignment between Limited Partners and Hedge Fund Managers": "Joey Summa",
    "Everything is sales.": "Leo Duarte",
    "Fractional Business": "Leo Duarte",
    "TechandBusiness.org Mission Statement": "Leo Duarte",
    "Passions (Rerelease)": "Leo Duarte",
    "My Journey": "Leo Duarte",
    "Beginnings": "Leo Duarte",
};

async function fixAuthors() {
    console.log('🔧 Fixing authors with correct Beehiiv data...\n');

    // Fetch all authors
    const authors = await client.fetch('*[_type == "author"]');
    const authorIdMap = {};
    authors.forEach(author => {
        authorIdMap[author.name] = author._id;
    });

    // Fetch all posts
    const posts = await client.fetch('*[_type == "post"]');

    let fixedCount = 0;

    for (const post of posts) {
        const correctAuthorName = authorMapping[post.title];

        if (correctAuthorName) {
            const authorId = authorIdMap[correctAuthorName];

            if (authorId) {
                await client
                    .patch(post._id)
                    .set({
                        author: {
                            _type: 'reference',
                            _ref: authorId
                        }
                    })
                    .commit();

                console.log(`✅ ${post.title} → ${correctAuthorName}`);
                fixedCount++;
            }
        } else {
            // Default to Leo for unmapped articles
            const leoId = authorIdMap['Leo Duarte'];
            await client
                .patch(post._id)
                .set({
                    author: {
                        _type: 'reference',
                        _ref: leoId
                    }
                })
                .commit();
            console.log(`📝 ${post.title} → Leo Duarte (default)`);
            fixedCount++;
        }
    }

    console.log(`\n✅ Fixed ${fixedCount} articles with correct authors!`);
}

fixAuthors().catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
});
