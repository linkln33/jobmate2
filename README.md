# JobMate

<div align="center">

![JobMate Logo](public/logo.png)

**A modern, AI-enhanced marketplace connecting customers with skilled specialists**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

</div>

JobMate is a modern, AI-enhanced, full-stack gig marketplace for maintenance and handyman jobs — like Uber + Upwork + TaskRabbit but smarter, faster, and focused on trust, context-awareness, and ease-of-use. Our proprietary compatibility engine revolutionizes how customers and specialists are matched, evaluating multiple dimensions beyond simple availability and pricing.

## 🚀 Purpose & Vision

JobMate transforms how skilled services are discovered, matched, and delivered by addressing critical industry pain points:

- **Trust Deficit**: Comprehensive verification system for specialists and transparent reviews
- **Skill Mismatches**: AI-powered compatibility engine instead of basic keyword matching
- **Scheduling Friction**: Smart scheduling with real-time availability and optimization
- **Price Uncertainty**: Transparent pricing with AI-assisted cost estimation
- **Communication Gaps**: Integrated messaging and video consultation tools

Our platform connects customers with skilled local specialists through:

- **Rich Media Job Posting**: Text, image, video, or voice descriptions
- **Location Intelligence**: Map-based job browsing with proximity optimization
- **AI-Powered Matching**: Multi-dimensional compatibility scoring
- **Real-time Communication**: Instant messaging and status updates
- **Secure Payments**: Integrated wallet and milestone payment options

## 🧩 Platform Features

### 👤 Unified User System
JobMate uses a unified user model where all users have a single account with access to both customer and specialist functionality:

**Core Features:**
- Single unified profile with role-based functionality
- Seamless switching between customer and specialist modes
- Shared dashboard for all platform activities
- Consistent user experience across all platform interactions
- Unified notification system for all account activities
- Integrated reputation system across all platform roles

**Customer Features:**
- Post jobs with rich media (photos, videos, voice descriptions)
- Receive AI-powered issue diagnosis and cost estimates
- Schedule appointments with smart calendar integration
- Track job status in real-time with notifications
- Pay via integrated wallet, Stripe, or milestone payments
- Rate and review completed services

**Specialist Features:**
- Create verified credentials with ID/license verification
- Define service areas, specialties, and pricing models
- Set availability preferences and service hours
- Browse jobs via map or list view with compatibility scores
- Accept, decline, or negotiate terms through built-in chat
- Manage appointments with calendar synchronization
- Receive secure payments with flexible payout options

### 🔧️ Admin
- Manage disputes and platform governance
- Verify user credentials and maintain trust standards
- Monitor platform health metrics and generate reports
- Create and manage community features (guilds, regions, rewards)

## 🏗️ Tech Stack

- **Frontend**: Next.js 14.2, React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, Supabase Functions
- **Database**: PostgreSQL with PostGIS via Supabase
- **Real-time**: Supabase Realtime
- **AI Services**: OpenAI API, Algolia Search
- **Maps**: Google Maps API, Mapbox
- **Payments**: Stripe Connect
- **Hosting**: Vercel
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage, Cloudinary

## 📄 White Paper: JobMate Platform Overview

> **Note:** For the complete whitepaper, see [JobMate_Whitepaper.md](./JobMate_Whitepaper.md) in the project root.
>
> To convert the whitepaper to PDF, you can use online Markdown to PDF converters like [MD2PDF](https://md2pdf.netlify.app/) or [Markdown to PDF](https://www.markdowntopdf.com/), or install a tool like `pandoc` with a PDF engine.

### 1. Market Opportunity

The global gig economy is projected to reach $455 billion by 2026, with skilled services representing over 35% of this market. JobMate addresses critical industry pain points including trust deficit, skill mismatches, scheduling friction, price uncertainty, and communication gaps.

### 2. Core Platform Features

#### 2.1 AI-Powered Compatibility Engine

The heart of JobMate is our proprietary compatibility engine that goes beyond simple keyword matching:

- **Multi-dimensional Scoring**: Evaluates 10+ dimensions including skills, location, pricing, availability, and work style
- **Category-Specific Algorithms**: Specialized scoring algorithms for different service categories
- **Contextual Awareness**: Incorporates time of day, weather, urgency, and other contextual factors
- **Continuous Learning**: Improves matches based on successful outcomes and feedback

#### 2.2 Advanced Marketplace

- **Multi-category Support**: Jobs, services, rentals, items, favors, and community requests
- **Rich Media Listings**: Support for images, videos, audio descriptions, and 3D models
- **Verified Listings**: Trust badges, verification status, and quality indicators

#### 2.3 Communication & Payments

- **Real-time Messaging**: Instant messaging with media sharing capabilities
- **Video Consultations**: Built-in video calling for remote diagnostics
- **Milestone Payments**: Release funds as project stages complete
- **Instant Payouts**: Quick access to earnings for specialists

### 3. Technical Innovation

#### 3.1 AI and Machine Learning

- **Natural Language Processing**: Understanding job descriptions and requirements
- **Computer Vision**: Analyzing images to identify issues and requirements
- **Recommendation Systems**: Personalized suggestions for both customers and specialists

#### 3.2 Location Intelligence

- **Proximity Optimization**: Matching based on service area and travel distance
- **Route Planning**: Efficient scheduling for specialists with multiple jobs
- **Geofencing**: Automated check-in/check-out for job verification

### 4. Competitive Advantage

JobMate differentiates itself from competitors through:

- **AI-Powered Matching**: Superior compatibility algorithms vs. basic keyword matching
- **Multi-Dimensional Trust**: Comprehensive verification vs. simple reviews
- **Contextual Intelligence**: Adaptation to situational factors vs. static matching
- **Seamless Experience**: End-to-end service journey vs. fragmented processes

### 5. Future Roadmap

- **AR/VR Integration**: Virtual site visits and enhanced diagnostics
- **IoT Connectivity**: Integration with smart home devices for diagnostics
- **Blockchain Credentials**: Decentralized verification of specialist qualifications
- **AI Assistants**: Specialized virtual assistants for different service categories

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (for database, auth, and storage)
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/linkln33/jobmate2.git
cd jobmate2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

JobMate is configured for deployment on Vercel:

```bash
# Login to Vercel
vercel login

# Deploy to Vercel
vercel
```

Alternatively, connect your GitHub repository to Vercel for automatic deployments on push.

#### Environment Variables

Make sure to configure the following environment variables in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `NEXT_PUBLIC_APP_URL`: Your application URL
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `JWT_SECRET`: Secret for JWT token generation
- Additional API keys for services like OpenAI, Algolia, etc.

## 📱 Features

- **Job System**: Post, browse, and manage maintenance jobs
- **Map View**: Browse jobs on an interactive map
- **Real-time Chat**: Communicate directly with customers/specialists
- **AI Diagnosis**: Automatically identify issues from photos
- **Smart Scheduling**: AI-powered scheduling assistant
- **Price Calculator**: AI-powered project cost estimation based on multiple factors
- **Secure Payments**: Integrated wallet and payment system
- **Verification**: ID and license verification for specialists
- **Reviews & Ratings**: Build reputation through quality work
- **Notifications**: Real-time updates on job status

## 📊 Project Structure

```
jobmate2/
├─ public/           # Static assets
├─ src/
│   ├─ app/          # Next.js app router with API routes
│   ├─ components/   # React components organized by feature
│   ├─ hooks/        # Custom React hooks
│   ├─ lib/          # Utility functions and libraries
│   ├─ models/       # Data models and interfaces
│   ├─ services/     # Service layer for API and business logic
│   │   ├─ api/       # API service clients
│   │   ├─ compatibility/ # Compatibility engine
│   │   └─ database/  # Database access layer
│   ├─ styles/       # Global styles and Tailwind configuration
│   ├─ types/        # TypeScript type definitions
│   └─ utils/        # Utility functions
├─ prisma/           # Database schema and migrations
├─ middleware.ts     # Next.js middleware
├─ vercel.json       # Vercel deployment configuration
└─ .env.example      # Example environment variables
```

## 🧪 Development Phases

1. **Phase 1: MVP** - Core functionality, job posting, map browsing, chat, payments
2. **Phase 2: AI Layer** - AI job creation, smart scheduling, pricing suggestions
3. **Phase 3: Gamification & Scaling** - Ratings, badges, leaderboards, analytics
4. **Phase 4: Mobile Apps** - Native mobile applications

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by platforms like Uber, Upwork, and TaskRabbit
- Built with modern web technologies and AI integration
