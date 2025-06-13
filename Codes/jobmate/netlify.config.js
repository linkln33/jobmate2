// netlify.config.js
module.exports = {
  // Ensure Next.js builds correctly on Netlify
  build: {
    environment: {
      NETLIFY_NEXT_PLUGIN_SKIP: "true"
    }
  }
};
