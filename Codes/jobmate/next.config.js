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
  // Output static files for Netlify
  output: 'export',
};

module.exports = nextConfig;
