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
  },
  
  // Always use port 3000
  server: {
    port: 3000,
  },
};

module.exports = nextConfig;
