/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configure images for static export
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
    ],
    unoptimized: true, // Required for static export
  },
  
  // Enable static exports
  output: 'export',
  
  // Disable server components for static export
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
