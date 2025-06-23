// Custom Netlify plugin to handle Prisma during build
module.exports = {
  onPreBuild: async ({ utils }) => {
    console.log('🔌 Running Prisma Build Plugin');
    
    try {
      // Generate Prisma client
      console.log('📦 Generating Prisma client...');
      await utils.run.command('npx prisma generate');
      console.log('✅ Prisma client generated successfully');
    } catch (error) {
      console.error('❌ Error generating Prisma client:', error);
      utils.build.failBuild('Failed to generate Prisma client');
    }
  }
};
