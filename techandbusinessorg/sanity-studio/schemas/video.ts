import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'video',
    title: 'Video/Reel',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'anchor',
            title: 'Anchor/Creator',
            type: 'reference',
            to: [{ type: 'author' }],
            description: 'The person who created this video',
        }),
        defineField({
            name: 'videoUrl',
            title: 'Video URL',
            type: 'url',
            validation: (Rule) => Rule.required(),
            description: 'Link to the video on TikTok, Instagram, or YouTube',
        }),
        defineField({
            name: 'platform',
            title: 'Platform',
            type: 'string',
            options: {
                list: [
                    { title: 'TikTok', value: 'TikTok' },
                    { title: 'Instagram', value: 'Instagram' },
                    { title: 'YouTube', value: 'YouTube' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Market Analysis', value: 'Market Analysis' },
                    { title: 'Tech Trends', value: 'Tech Trends' },
                    { title: "Founder's Log", value: "Founder's Log" },
                    { title: 'Finance', value: 'Finance' },
                    { title: 'Entrepreneurship', value: 'Entrepreneurship' },
                    { title: 'Technology', value: 'Technology' },
                ],
            },
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'thumbnail',
            title: 'Custom Thumbnail',
            type: 'image',
            description: 'Optional custom thumbnail (will use platform default if not provided)',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'platform',
            media: 'thumbnail',
            anchor: 'anchor.name',
        },
        prepare({ title, subtitle, media, anchor }) {
            return {
                title,
                subtitle: `${subtitle} • ${anchor || 'No anchor'}`,
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Published Date, New',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
})
