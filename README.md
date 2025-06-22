# JobMate

JobMate is a modern, AI-enhanced, full-stack gig marketplace for maintenance and handyman jobs — like Uber + Upwork + TaskRabbit but smarter, faster, and focused on trust, context-awareness, and ease-of-use.

## 🚀 Purpose

To connect customers with skilled local specialists (plumbers, electricians, etc.) through an intuitive, mobile-first platform where:

- Customers can post jobs (text, image, video, or voice)
- Specialists can browse jobs on a map, accept and negotiate
- AI handles scheduling, diagnostics, and smart matchmaking
- Real-time communication, availability, and payments are integrated

## 🧩 Platform Roles

### 👤 Customers
- Post jobs
- Upload media (photo/video)
- Describe issue by voice or text
- Auto-detect issue via AI
- Schedule appointments
- Pay via wallet/Stripe
- Track status, rate pros

### 🧑‍🔧 Specialists
- Register with verified ID/license
- Define services, radius, price range
- Toggle "On Duty" to receive jobs (Uber-style)
- Browse/map view of jobs
- Accept/decline, negotiate via chat
- Sync Google Calendar
- Withdraw earnings via wallet

### 🛠️ Admin
- Manage disputes
- Verify specialists
- Monitor platform health and reports
- Create guilds, regions, reward campaigns

## 🏗️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with PostGIS
- **Real-time**: Socket.io
- **AI Services**: OpenAI API, Google Vision API
- **Maps**: Google Maps API
- **Payments**: Stripe Connect
- **Hosting**: Vercel (Frontend), Railway/Render (Backend)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later with PostGIS extension
- Google Maps API key
- Stripe account
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jobmate.git
   cd jobmate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your API keys and configuration.

4. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
jobmate/
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js app router
│   ├── components/   # React components
│   ├── lib/          # Utility functions and libraries
│   ├── server/       # Server-side code
│   ├── styles/       # Global styles
│   └── types/        # TypeScript type definitions
├── prisma/           # Database schema and migrations
└── middleware.ts     # Next.js middleware
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
