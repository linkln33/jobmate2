/**
 * Description Generator Service
 * 
 * Provides simulated job description generation for various job types.
 * In a production environment, this would use GPT-4 or another LLM to generate custom descriptions.
 */

import { AssistantMode } from '@/contexts/AssistantContext/types';

// Job types with templates
export interface JobTypeTemplate {
  name: string;
  keywords: string[];
  template: string;
}

/**
 * Generate a job description based on job type and optional parameters
 */
export const generateJobDescription = (
  jobType: string,
  params: {
    businessName?: string;
    timeline?: string;
    budgetMin?: number;
    budgetMax?: number;
    specificRequirements?: string[];
  } = {}
): string => {
  // Get the base template
  let template = getTemplateForJobType(jobType);
  
  // Replace placeholders with provided parameters
  if (params.businessName) {
    template = template.replace(/\[your business\/personal use\]/g, params.businessName);
    template = template.replace(/\[your business\]/g, params.businessName);
  }
  
  if (params.timeline) {
    template = template.replace(/\[timeframe, e\.g\., \d+ weeks\]/g, params.timeline);
  }
  
  if (params.budgetMin && params.budgetMax) {
    template = template.replace(/\$\[amount\] - \$\[amount\]/g, `$${params.budgetMin} - $${params.budgetMax}`);
  }
  
  if (params.specificRequirements && params.specificRequirements.length > 0) {
    // Find the requirements section and add specific requirements
    const requirementsRegex = /(## Requirements[\s\S]*?)(## Skills Required)/;
    const match = template.match(requirementsRegex);
    
    if (match) {
      const requirementsSection = match[1];
      const updatedRequirementsSection = requirementsSection + params.specificRequirements.map(req => `- ${req}\n`).join('');
      template = template.replace(requirementsSection, updatedRequirementsSection);
    }
  }
  
  return template;
};

/**
 * Generate a job description based on a user query
 */
export const generateDescriptionFromQuery = (query: string, mode: AssistantMode): string => {
  const queryLower = query.toLowerCase();
  
  // Extract job type from query
  let jobType = 'web development'; // Default
  
  // Try to identify job type from query
  for (const template of jobTemplates) {
    for (const keyword of template.keywords) {
      if (queryLower.includes(keyword)) {
        jobType = template.name;
        break;
      }
    }
  }
  
  // Extract parameters from query
  const params: {
    businessName?: string;
    timeline?: string;
    budgetMin?: number;
    budgetMax?: number;
    specificRequirements?: string[];
  } = {};
  
  // Extract business name (simple approach)
  const businessNameMatch = query.match(/for ([\w\s]+) (company|business|organization|website|app|project)/i);
  if (businessNameMatch) {
    params.businessName = businessNameMatch[1].trim();
  }
  
  // Extract timeline
  const timelineMatch = query.match(/(\d+)\s*(day|week|month)s?/i);
  if (timelineMatch) {
    params.timeline = `${timelineMatch[1]} ${timelineMatch[2]}${parseInt(timelineMatch[1]) > 1 ? 's' : ''}`;
  }
  
  // Extract budget
  const budgetMatch = query.match(/budget\s*[of|is|:]*\s*\$?(\d+)\s*-\s*\$?(\d+)/i);
  if (budgetMatch) {
    params.budgetMin = parseInt(budgetMatch[1]);
    params.budgetMax = parseInt(budgetMatch[2]);
  }
  
  // Extract specific requirements (simple approach)
  const requirementMatches = query.match(/need[s]?\s+([^.,;]+)/ig);
  if (requirementMatches) {
    params.specificRequirements = requirementMatches.map(match => {
      return match.replace(/need[s]?\s+/i, '').trim();
    });
  }
  
  return generateJobDescription(jobType, params);
};

// Get template based on job type
const getTemplateForJobType = (jobType: string): string => {
  const jobTypeLower = jobType.toLowerCase();
  
  // Find matching template
  for (const template of jobTemplates) {
    if (template.name.toLowerCase() === jobTypeLower) {
      return template.template;
    }
    
    // Check keywords
    for (const keyword of template.keywords) {
      if (jobTypeLower.includes(keyword)) {
        return template.template;
      }
    }
  }
  
  // Default template if no match found
  return defaultTemplate;
};

// Default template
const defaultTemplate = `
# [Project Title]

## Project Overview
Looking for a skilled professional to help with my project. The ideal candidate will have relevant experience and be able to deliver high-quality work within the specified timeline.

## Requirements
- High-quality deliverables that meet project specifications
- Regular communication and progress updates
- Ability to incorporate feedback and make revisions as needed

## Skills Required
- Relevant technical skills for the project
- Strong communication skills
- Attention to detail
- Problem-solving ability

## Timeline
The project should be completed within [timeframe, e.g., 4 weeks] from the start date.

## Budget
$[amount] - $[amount]

## Additional Information
Please include examples of similar projects you've completed in your proposal.
`;

// Web development template
const webDevelopmentTemplate = `
# Web Development Project

## Project Overview
Looking for an experienced web developer to create a professional website for [your business/personal use]. The website should be modern, responsive, and user-friendly.

## Requirements
- Responsive design that works well on desktop, tablet, and mobile devices
- User-friendly navigation and interface
- Integration with [specific tools/platforms if applicable]
- SEO optimization
- Contact form functionality
- [Any other specific features]

## Skills Required
- HTML, CSS, JavaScript
- Responsive design experience
- [Specific frameworks if needed: React, Angular, Vue, etc.]
- Experience with [CMS if applicable: WordPress, Shopify, etc.]
- SEO knowledge

## Timeline
The project should be completed within [timeframe, e.g., 4 weeks] from the start date.

## Budget
$[amount] - $[amount]

## Additional Information
Please include examples of similar websites you've built in your proposal.
`;

// Mobile development template
const mobileDevelopmentTemplate = `
# Mobile App Development Project

## Project Overview
Seeking a skilled mobile app developer to create a [type of app] for [iOS/Android/both]. The app should be intuitive, fast, and provide a seamless user experience.

## Requirements
- Native app development for [iOS/Android/both]
- User authentication and profile management
- [Specific features of the app]
- Integration with [APIs/services if applicable]
- Performance optimization
- App store submission assistance

## Skills Required
- [Swift/Kotlin/React Native/Flutter] development experience
- UI/UX design principles for mobile
- API integration
- Experience with app store submission process
- [Any other specific skills]

## Timeline
The project should be completed within [timeframe, e.g., 8 weeks] from the start date.

## Budget
$[amount] - $[amount]

## Additional Information
Please share examples of apps you've developed and their performance metrics if available.
`;

// Design template
const designTemplate = `
# Design Project

## Project Overview
Looking for a talented designer to create [type of design: logo, branding materials, website design, etc.] for [your business/personal use]. The design should reflect [brand values/aesthetic preferences].

## Requirements
- [Specific design elements]
- [Color scheme preferences if any]
- [Style guidelines if applicable]
- Delivery of files in [formats: AI, PSD, etc.]
- [Number of revisions included]

## Skills Required
- Proficiency in [design software: Adobe Creative Suite, Figma, etc.]
- Experience with [type of design]
- Understanding of brand identity principles
- [Any other specific skills]

## Timeline
The project should be completed within [timeframe, e.g., 2 weeks] from the start date.

## Budget
$[amount] - $[amount]

## Additional Information
Please include your portfolio or examples of similar work in your proposal.
`;

// Content writing template
const contentWritingTemplate = `
# Content Writing Project

## Project Overview
Seeking a skilled content writer to create engaging and SEO-friendly content for [your business/personal use]. The content should be well-researched, error-free, and tailored to our target audience.

## Requirements
- [Number of articles/posts] with [word count] words each
- SEO optimization with targeted keywords
- Well-researched content with credible sources
- Error-free grammar and spelling
- Engaging and readable style
- Original content that passes plagiarism checks

## Skills Required
- Excellent writing and editing skills
- SEO knowledge and keyword optimization
- Research capabilities
- Understanding of content marketing principles
- Experience in [specific industry/niche if applicable]

## Timeline
The project should be completed within [timeframe, e.g., 2 weeks] from the start date.

## Budget
$[amount] - $[amount]

## Additional Information
Please include writing samples relevant to our industry in your proposal.
`;

// Digital marketing template
const digitalMarketingTemplate = `
# Digital Marketing Project

## Project Overview
Looking for an experienced digital marketing specialist to help [your business] increase online visibility, drive traffic, and generate leads/sales. The campaign should focus on [specific goals/platforms].

## Requirements
- Comprehensive digital marketing strategy
- Campaign setup and management on [specific platforms]
- Regular performance reporting and analytics
- Optimization based on data and results
- [Any specific KPIs or targets]

## Skills Required
- Experience with [specific platforms: Google Ads, Facebook, Instagram, etc.]
- Data analysis and reporting capabilities
- Understanding of conversion optimization
- Content creation for marketing purposes
- [Any other specific skills]

## Timeline
The project should run for [timeframe, e.g., 3 months] with regular reporting and optimization.

## Budget
$[amount] - $[amount] per month

## Additional Information
Please share case studies of similar campaigns you've managed and the results achieved.
`;

// Data analysis template
const dataAnalysisTemplate = `
# Data Analysis Project

## Project Overview
Seeking a skilled data analyst to help [your business] make sense of [type of data] and provide actionable insights. The analysis should help us [specific goal: improve operations, increase sales, etc.].

## Requirements
- Data cleaning and preparation
- Comprehensive analysis using appropriate statistical methods
- Visualization of key findings
- Written report with actionable recommendations
- [Any specific analysis requirements]

## Skills Required
- Proficiency in [specific tools: Excel, SQL, Python, R, Tableau, etc.]
- Statistical analysis experience
- Data visualization skills
- Clear communication of technical concepts
- Experience with [specific industry/data type if applicable]

## Timeline
The project should be completed within [timeframe, e.g., 3 weeks] from the start date.

## Budget
$[amount] - $[amount]

## Additional Information
Please include examples of similar analyses you've conducted and the impact of your recommendations.
`;

// Video production template
const videoProductionTemplate = `
# Video Production Project

## Project Overview
Looking for a talented video professional to create [type of video: promotional, explainer, tutorial, etc.] for [your business]. The video should effectively communicate our [message/product/service] to our target audience.

## Requirements
- [Video length] minute high-quality video
- Script development and storyboarding
- Professional voiceover (if needed)
- Custom graphics and animations (if needed)
- Background music and sound effects
- Editing and post-production

## Skills Required
- Experience with video production and editing
- Proficiency in [specific software: Adobe Premiere, After Effects, etc.]
- Storytelling and creative direction
- Audio editing capabilities
- [Any other specific skills]

## Timeline
The project should be completed within [timeframe, e.g., 4 weeks] from the start date.

## Budget
$[amount] - $[amount]

## Additional Information
Please share your portfolio or showreel with examples of similar videos you've produced.
`;

// Collection of job templates
const jobTemplates: JobTypeTemplate[] = [
  {
    name: 'web development',
    keywords: ['web', 'website', 'webpage', 'landing page', 'e-commerce', 'ecommerce', 'online store'],
    template: webDevelopmentTemplate
  },
  {
    name: 'mobile development',
    keywords: ['mobile', 'app', 'ios', 'android', 'flutter', 'react native'],
    template: mobileDevelopmentTemplate
  },
  {
    name: 'design',
    keywords: ['design', 'logo', 'branding', 'ui', 'ux', 'graphic'],
    template: designTemplate
  },
  {
    name: 'content writing',
    keywords: ['content', 'writing', 'blog', 'article', 'copywriting'],
    template: contentWritingTemplate
  },
  {
    name: 'digital marketing',
    keywords: ['marketing', 'seo', 'ppc', 'social media', 'ads', 'advertising'],
    template: digitalMarketingTemplate
  },
  {
    name: 'data analysis',
    keywords: ['data', 'analysis', 'analytics', 'visualization', 'dashboard'],
    template: dataAnalysisTemplate
  },
  {
    name: 'video production',
    keywords: ['video', 'editing', 'animation', 'motion graphics', 'filming'],
    template: videoProductionTemplate
  }
];

export default {
  generateJobDescription,
  generateDescriptionFromQuery,
  jobTemplates
};
