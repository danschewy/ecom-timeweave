/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos"], // Allow images from picsum.photos
  },
  env: {
    POSTGRES_URL: process.env.POSTGRES_URL,
    TIMESCALE_URL: process.env.TIMESCALE_URL,
    WEAVIATE_URL: process.env.WEAVIATE_URL,
    WEAVIATE_API_KEY: process.env.WEAVIATE_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Enable experimental features if needed
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
