/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static export for Netlify
  output: 'export',
  
  reactStrictMode: true,
  
  // Needed for static export
  distDir: 'out',
  
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
    ],
    // Required for static export
    unoptimized: true,
  },
  
  // Enable trailing slashes for better compatibility
  trailingSlash: true,
  
  // Disable server-side features since we're using static export
  experimental: {
    serverActions: false,
  },
};

module.exports = nextConfig;
