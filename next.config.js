/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: [
      'localhost',
      'jobmate.app',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
    ],
  },
  
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
