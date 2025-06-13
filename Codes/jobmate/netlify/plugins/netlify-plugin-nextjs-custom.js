// Custom Next.js plugin for Netlify
module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('Preparing Next.js build for Netlify deployment...');
  },
  onBuild: ({ utils }) => {
    console.log('Building Next.js application for Netlify...');
  },
  onPostBuild: ({ utils }) => {
    console.log('Next.js build completed successfully!');
  },
};
