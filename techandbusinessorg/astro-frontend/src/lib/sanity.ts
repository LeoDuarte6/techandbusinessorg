import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client configuration
// You'll need to replace these with your actual Sanity project details
export const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '5gz8vb6c',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: true, // Use CDN for faster response times
  apiVersion: '2024-11-24', // Use current date
});

// Image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Helper functions to fetch data from Sanity

export async function getLatestVideo() {
  const query = `*[_type == "video"] | order(publishedAt desc)[0] {
    _id,
    title,
    videoUrl,
    platform,
    category,
    publishedAt,
    "anchor": anchor->{name, slug, headshot}
  }`;
  return await client.fetch(query);
}

export async function getAllVideos(limit = 12) {
  const query = `*[_type == "video"] | order(publishedAt desc)[0...${limit}] {
    _id,
    title,
    videoUrl,
    platform,
    category,
    publishedAt,
    thumbnail,
    "anchor": anchor->{name, slug, headshot}
  }`;
  return await client.fetch(query);
}

export async function getAllPosts(limit = 10) {
  const query = `*[_type == "post"] | order(publishedAt desc)[0...${limit}] {
    _id,
    title,
    slug,
    mainImage,
    excerpt,
    publishedAt,
    readTime,
    "author": author->{name, slug, headshot}
  }`;
  return await client.fetch(query);
}

export async function getPostBySlug(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    readTime,
    body,
    "author": author->{name, slug, role, headshot, bio}
  }`;
  return await client.fetch(query, { slug });
}

export async function getAllEpisodes() {
  const query = `*[_type == "episode"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    episodeNumber,
    publishedAt,
    spotifyEmbed,
    appleEmbed,
    showNotes,
    coverArt,
    "hosts": hosts[]->{name, slug, headshot},
    "guests": guests[]->{name, slug, headshot}
  }`;
  return await client.fetch(query);
}

export async function getAuthorBySlug(slug: string) {
  const query = `*[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    role,
    headshot,
    bio,
    socialLinks
  }`;
  return await client.fetch(query, { slug });
}
