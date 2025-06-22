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
    // Required for Netlify compatibility
    unoptimized: true,
  },
  // Server Actions are enabled by default in Next.js 14
  // Port is configured via package.json scripts
  // Increase memory limit
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 60 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  // Enable SPA-like behavior for better Netlify compatibility
  trailingSlash: true,
  // This helps with client-side routing on Netlify
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
