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
  
  // Next.js 14+ has server actions enabled by default
  // No need for experimental flags
};

module.exports = nextConfig;
