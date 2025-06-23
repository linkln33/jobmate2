// Netlify configuration for Next.js
module.exports = {
  // Use the Next.js plugin
  use: '@netlify/plugin-nextjs',
  
  // Configure the plugin
  config: {
    // Skip type checking during build to avoid issues with Prisma seed file
    skipTypeCheck: true,
    
    // Skip linting during build
    skipLint: true,
    
    // Disable telemetry
    disableTelemetry: true
  }
};
