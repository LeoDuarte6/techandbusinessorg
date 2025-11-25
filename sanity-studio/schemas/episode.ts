import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'episode',
    title: 'Podcast Episode',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'episodeNumber',
            title: 'Episode Number',
            type: 'number',
        }),
        defineField({
            name: 'hosts',
            title: 'Hosts',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'author' }] }],
        }),
        defineField({
            name: 'guests',
            title: 'Guests',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'author' }] }],
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'spotifyEmbed',
            title: 'Spotify Embed Code',
            type: 'text',
            rows: 3,
            description: 'Paste the Spotify embed iframe code here',
        }),
        defineField({
            name: 'appleEmbed',
            title: 'Apple Podcasts Embed Code',
            type: 'text',
            rows: 3,
            description: 'Paste the Apple Podcasts embed iframe code here',
        }),
        defineField({
            name: 'showNotes',
            title: 'Show Notes',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [{ title: 'Normal', value: 'normal' }],
                    marks: {
                        decorators: [
                            { title: 'Strong', value: 'strong' },
                            { title: 'Emphasis', value: 'em' },
                        ],
                        annotations: [
                            {
                                name: 'link',
                                type: 'object',
                                title: 'Link',
                                fields: [{ name: 'href', type: 'url', title: 'URL' }],
                            },
                        ],
                    },
                },
            ],
        }),
        defineField({
            name: 'coverArt',
            title: 'Cover Art',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
    ],
    preview: {
        select: {
            title: 'title',
            episodeNumber: 'episodeNumber',
            media: 'coverArt',
        },
        prepare({ title, episodeNumber, media }) {
            return {
                title: episodeNumber ? `Episode ${episodeNumber}: ${title}` : title,
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Episode Number, New',
            name: 'episodeNumberDesc',
            by: [{ field: 'episodeNumber', direction: 'desc' }],
        },
        {
            title: 'Published Date, New',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
})
