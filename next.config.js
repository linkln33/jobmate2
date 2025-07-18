/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'rjqpjanwnrzuizzozpsm.supabase.co',
    ],
  },
};

module.exports = nextConfig;
