# JobMate

<div align="center">

![JobMate Logo](public/logo.png)

**The Ultimate All-in-One Marketplace Platform: Items, Services, Rentals, and Jobs**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

</div>

JobMate is a revolutionary, AI-enhanced, full-stack marketplace platform that combines the best features of Airbnb, Uber, eBay, Upwork, and TaskRabbit into a single, unified ecosystem. Our platform offers four distinct but integrated marketplaces: **Items** (buy/sell), **Services** (offer/hire), **Rentals** (list/book), and **Jobs** (post/find). Powered by our proprietary compatibility engine, JobMate revolutionizes how people connect, trade, and collaborate by evaluating multiple dimensions beyond simple availability and pricing.

## 🚀 Purpose & Vision

JobMate transforms how people exchange goods and services in the digital economy by creating a comprehensive ecosystem that addresses critical marketplace pain points:

- **Trust Deficit**: Comprehensive verification system for specialists and transparent reviews
- **Skill Mismatches**: AI-powered compatibility engine instead of basic keyword matching
- **Scheduling Friction**: Smart scheduling with real-time availability and optimization
- **Price Uncertainty**: Transparent pricing with AI-assisted cost estimation
- **Communication Gaps**: Integrated messaging and video consultation tools

Our unified platform connects users across four integrated marketplaces through:

- **Rich Media Job Posting**: Text, image, video, or voice descriptions
- **Location Intelligence**: Map-based job browsing with proximity optimization
- **AI-Powered Matching**: Multi-dimensional compatibility scoring
- **Real-time Communication**: Instant messaging and status updates
- **Secure Payments**: Integrated wallet and milestone payment options

## 🧩 Platform Features

### 🛒 Four Integrated Marketplaces

**1. Items Marketplace**
- Buy and sell new or used products with secure transactions
- Rich media listings with multiple photos and videos
- Categories spanning electronics, furniture, clothing, and more
- Verified seller badges and buyer protection
- Smart price suggestions based on market data

**2. Services Marketplace**
- Offer or hire professional and personal services
- Verified credentials and skill validation
- Hourly, fixed-price, or subscription-based pricing models
- Service area mapping with proximity optimization
- Video consultations and remote service options

**3. Rentals Marketplace**
- List or book properties, vehicles, equipment, and more
- Flexible rental periods from hours to months
- Calendar integration with availability management
- Damage protection and security deposit handling
- Check-in/check-out verification system

**4. Jobs Marketplace**
- Post or find short and long-term employment opportunities
- Project-based, temporary, or permanent positions
- Skill matching and compatibility scoring
- Milestone-based work tracking and payment release
- Performance reviews and work history verification

### 👤 Unified User System
JobMate uses a unified user model where all users have a single account with access to all marketplace functionality:

**Core Features:**
- Single unified profile with role-based functionality
- Seamless switching between seller, buyer, provider, and client modes
- Comprehensive dashboard for managing all marketplace activities
- Consistent user experience across all four marketplaces
- Unified notification system for all account activities
- Integrated reputation system that carries across all platform roles
- Universal wallet for all transactions and earnings

**Buyer/Client Features:**
- Browse all four marketplaces with unified search and filters
- Post jobs or rental requests with rich media (photos, videos, voice)
- Receive AI-powered recommendations and cost estimates
- Schedule appointments with smart calendar integration
- Track orders, rentals, and job status in real-time
- Pay via integrated wallet, Stripe, or milestone payments
- Rate and review sellers, service providers, and rental hosts

**Seller/Provider Features:**
- List items, services, rentals, or professional skills
- Create verified credentials with ID/license verification
- Define service areas, specialties, and pricing models
- Set availability preferences and scheduling options
- Browse opportunities via map or list view with compatibility scores
- Accept, decline, or negotiate terms through built-in chat
- Manage inventory, appointments, and rental calendars
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

- **Multi-dimensional Scoring**: Evaluates 10+ dimensions including product condition, service quality, rental terms, job requirements, location, pricing, availability, and interaction style
- **Marketplace-Specific Algorithms**: Specialized scoring algorithms for each of our four marketplaces
- **Cross-Marketplace Intelligence**: Identifies opportunities across marketplaces (e.g., suggesting rental equipment for a service provider)
- **Contextual Awareness**: Incorporates time of day, weather, urgency, seasonality, and other contextual factors
- **Continuous Learning**: Improves matches based on successful outcomes and feedback

#### 2.2 Advanced Marketplace Ecosystem

- **Integrated Four-Market System**: Seamless interaction between Items, Services, Rentals, and Jobs
- **Rich Media Listings**: Support for images, videos, audio descriptions, 3D models, and virtual tours
- **Verified Listings**: Trust badges, verification status, and quality indicators
- **Cross-Marketplace Bundles**: Ability to combine offerings across marketplaces (e.g., product + installation service)

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

- **All-in-One Platform**: Single platform for items, services, rentals, and jobs vs. specialized marketplaces
- **Cross-Marketplace Synergy**: Intelligent connections between different marketplace types
- **AI-Powered Matching**: Superior compatibility algorithms vs. basic keyword matching
- **Multi-Dimensional Trust**: Comprehensive verification vs. simple reviews
- **Contextual Intelligence**: Adaptation to situational factors vs. static matching
- **Seamless Experience**: End-to-end user journey vs. fragmented processes
- **Universal Reputation**: Unified trust score across all platform activities

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

### Items Marketplace
- **Product Listings**: Create detailed listings with multiple photos and specifications
- **Smart Categorization**: AI-powered category and tag suggestions
- **Price Comparison**: See similar items and suggested pricing
- **Condition Verification**: AI assessment of item condition from photos
- **Purchase Protection**: Secure transactions with buyer/seller protection

### Services Marketplace
- **Service Profiles**: Showcase skills, portfolio, and availability
- **Video Consultations**: Remote assessment and consultation tools
- **Smart Scheduling**: AI-powered scheduling assistant
- **Price Calculator**: AI-powered service cost estimation
- **Skill Verification**: Credential and expertise validation

### Rentals Marketplace
- **Property/Item Listings**: Detailed rental listings with availability calendars
- **Virtual Tours**: 3D tours and detailed photos of rental properties/items
- **Flexible Scheduling**: Hourly, daily, weekly, or monthly rental options
- **Damage Protection**: Built-in insurance and security deposit management
- **Check-in/out System**: Digital verification of rental condition

### Jobs Marketplace
- **Job System**: Post, browse, and manage employment opportunities
- **Skill Matching**: AI-powered candidate/job matching
- **Milestone Tracking**: Break projects into verifiable milestones
- **Work Verification**: Proof of work and quality assurance tools
- **Performance Analytics**: Track job completion metrics and feedback

### Platform-Wide Features
- **Map View**: Browse all marketplace offerings on an interactive map
- **Real-time Chat**: Communicate directly with any platform user
- **Secure Payments**: Integrated wallet and payment system
- **Verification**: ID and credential verification for all users
- **Reviews & Ratings**: Build reputation across all platform activities
- **Notifications**: Real-time updates on all marketplace activities

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

## 🛠️ Supabase Architecture

JobMate utilizes Supabase as its primary database and authentication provider. The Supabase architecture is designed to provide a scalable and secure foundation for the platform.

- **Database**: Supabase provides a PostgreSQL database for storing user data, marketplace listings, and other platform information.
- **Authentication**: Supabase Auth handles user authentication and authorization, providing features like email/password login, social login, and JWT token generation.
- **Realtime**: Supabase Realtime enables real-time updates and notifications across the platform, allowing for features like live updates and instant messaging.
- **Storage**: Supabase Storage provides a secure and scalable storage solution for user-uploaded files and media.

## 🙏 Acknowledgments

- Inspired by platforms like Uber, Upwork, and TaskRabbit
- Built with modern web technologies and AI integration
