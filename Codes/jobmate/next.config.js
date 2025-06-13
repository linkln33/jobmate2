/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
    ],
    // Keep this for Netlify compatibility
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
  // Ensure server always starts on port 3000
  server: {
    port: 3000,
  },
  // Increase memory limit
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 60 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  // Disable static export to use Netlify's Next.js plugin
  // output: 'export',
};

module.exports = nextConfig;
