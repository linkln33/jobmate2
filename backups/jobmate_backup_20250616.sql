--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Homebrew)
-- Dumped by pg_dump version 14.15 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: JobStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JobStatus" AS ENUM (
    'DRAFT',
    'OPEN',
    'ASSIGNED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'DISPUTED'
);


ALTER TYPE public."JobStatus" OWNER TO postgres;

--
-- Name: ReviewType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReviewType" AS ENUM (
    'POSITIVE',
    'NEUTRAL',
    'NEGATIVE'
);


ALTER TYPE public."ReviewType" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'CUSTOMER',
    'SPECIALIST',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AssistantAnalytics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AssistantAnalytics" (
    id text NOT NULL,
    "userId" text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "totalInteractions" integer DEFAULT 0 NOT NULL,
    "suggestionsShown" integer DEFAULT 0 NOT NULL,
    "suggestionsAccepted" integer DEFAULT 0 NOT NULL,
    "suggestionsDismissed" integer DEFAULT 0 NOT NULL,
    "manualQueries" integer DEFAULT 0 NOT NULL,
    "modeChanges" integer DEFAULT 0 NOT NULL,
    "timeSpentSeconds" integer DEFAULT 0 NOT NULL,
    "mostUsedMode" text
);


ALTER TABLE public."AssistantAnalytics" OWNER TO postgres;

--
-- Name: AssistantMemoryLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AssistantMemoryLog" (
    id text NOT NULL,
    "userId" text NOT NULL,
    mode text NOT NULL,
    "interactionType" text NOT NULL,
    context jsonb,
    "routePath" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AssistantMemoryLog" OWNER TO postgres;

--
-- Name: AssistantPreference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AssistantPreference" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "isEnabled" boolean DEFAULT true NOT NULL,
    "proactivityLevel" integer DEFAULT 2 NOT NULL,
    "preferredModes" text[],
    "dismissedSuggestions" text[],
    "lastInteraction" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AssistantPreference" OWNER TO postgres;

--
-- Name: AssistantSuggestion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AssistantSuggestion" (
    id text NOT NULL,
    "userId" text NOT NULL,
    mode text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "actionType" text,
    "actionPayload" jsonb,
    priority integer DEFAULT 2 NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AssistantSuggestion" OWNER TO postgres;

--
-- Name: Badge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Badge" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "iconUrl" text,
    criteria jsonb,
    category text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Badge" OWNER TO postgres;

--
-- Name: CustomerProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CustomerProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    address text,
    city text,
    state text,
    "zipCode" text,
    country text,
    latitude double precision,
    longitude double precision,
    "preferredCommunication" text,
    "savedPaymentMethods" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CustomerProfile" OWNER TO postgres;

--
-- Name: Dispute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Dispute" (
    id text NOT NULL,
    "jobId" text NOT NULL,
    "openedById" text NOT NULL,
    reason text NOT NULL,
    status text NOT NULL,
    resolution text,
    "resolvedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "resolvedAt" timestamp(3) without time zone
);


ALTER TABLE public."Dispute" OWNER TO postgres;

--
-- Name: DisputeMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DisputeMessage" (
    id text NOT NULL,
    "disputeId" text NOT NULL,
    "userId" text NOT NULL,
    message text NOT NULL,
    "attachmentUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."DisputeMessage" OWNER TO postgres;

--
-- Name: Guild; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Guild" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "logoUrl" text,
    "founderId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Guild" OWNER TO postgres;

--
-- Name: GuildMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GuildMember" (
    id text NOT NULL,
    "guildId" text NOT NULL,
    "userId" text NOT NULL,
    role text NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."GuildMember" OWNER TO postgres;

--
-- Name: Job; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Job" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "customerId" text NOT NULL,
    "serviceCategoryId" text NOT NULL,
    status public."JobStatus" DEFAULT 'DRAFT'::public."JobStatus" NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    state text,
    "zipCode" text NOT NULL,
    country text NOT NULL,
    "scheduledStartTime" timestamp(3) without time zone,
    "scheduledEndTime" timestamp(3) without time zone,
    "estimatedDuration" integer,
    "budgetMin" numeric(10,2),
    "budgetMax" numeric(10,2),
    "finalPrice" numeric(10,2),
    "urgencyLevel" text,
    "specialistId" text,
    "isRemote" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "cancelledAt" timestamp(3) without time zone,
    "cancellationReason" text,
    "aiGeneratedTags" jsonb
);


ALTER TABLE public."Job" OWNER TO postgres;

--
-- Name: JobMedia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobMedia" (
    id text NOT NULL,
    "jobId" text NOT NULL,
    "mediaType" text NOT NULL,
    "mediaUrl" text NOT NULL,
    "thumbnailUrl" text,
    description text,
    "aiAnalysis" jsonb,
    "isBefore" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."JobMedia" OWNER TO postgres;

--
-- Name: JobMilestone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobMilestone" (
    id text NOT NULL,
    "jobId" text NOT NULL,
    title text NOT NULL,
    description text,
    amount numeric(10,2) NOT NULL,
    status text NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."JobMilestone" OWNER TO postgres;

--
-- Name: JobProposal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobProposal" (
    id text NOT NULL,
    "jobId" text NOT NULL,
    "specialistId" text NOT NULL,
    price numeric(10,2) NOT NULL,
    message text,
    status text NOT NULL,
    "estimatedStartTime" timestamp(3) without time zone,
    "estimatedDuration" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."JobProposal" OWNER TO postgres;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "jobId" text,
    "senderId" text NOT NULL,
    "recipientId" text NOT NULL,
    "messageType" text NOT NULL,
    content text,
    "mediaUrl" text,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    data jsonb,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: PortfolioItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PortfolioItem" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text,
    "mediaUrls" text[],
    "serviceCategoryId" text,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PortfolioItem" OWNER TO postgres;

--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id text NOT NULL,
    "jobId" text NOT NULL,
    "reviewerId" text NOT NULL,
    "revieweeId" text NOT NULL,
    comment text,
    response text,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "communicationRating" integer,
    "costRating" integer,
    "editHistory" jsonb,
    "helpfulCount" integer DEFAULT 0 NOT NULL,
    "isEdited" boolean DEFAULT false NOT NULL,
    "isVerifiedPurchase" boolean DEFAULT true NOT NULL,
    "overallRating" integer NOT NULL,
    "reportCount" integer DEFAULT 0 NOT NULL,
    "reviewType" public."ReviewType" DEFAULT 'POSITIVE'::public."ReviewType" NOT NULL,
    "satisfactionRating" integer,
    "timingRating" integer
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: ReviewMedia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ReviewMedia" (
    id text NOT NULL,
    "reviewId" text NOT NULL,
    "mediaUrl" text NOT NULL,
    "mediaType" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ReviewMedia" OWNER TO postgres;

--
-- Name: SearchHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SearchHistory" (
    id text NOT NULL,
    "userId" text NOT NULL,
    query text NOT NULL,
    filters jsonb,
    "resultsCount" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SearchHistory" OWNER TO postgres;

--
-- Name: ServiceCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServiceCategory" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "iconUrl" text,
    "parentCategoryId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    color text,
    "coverImageUrl" text,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    emoji text,
    "isPopular" boolean DEFAULT false NOT NULL,
    "metaTags" text[],
    slug text
);


ALTER TABLE public."ServiceCategory" OWNER TO postgres;

--
-- Name: Skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Skill" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "iconUrl" text,
    "serviceCategoryId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Skill" OWNER TO postgres;

--
-- Name: SkillEndorsement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SkillEndorsement" (
    id text NOT NULL,
    "userSkillId" text NOT NULL,
    "endorserId" text NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SkillEndorsement" OWNER TO postgres;

--
-- Name: SpecialistAvailability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SpecialistAvailability" (
    id text NOT NULL,
    "specialistId" text NOT NULL,
    "dayOfWeek" integer NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SpecialistAvailability" OWNER TO postgres;

--
-- Name: SpecialistCertification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SpecialistCertification" (
    id text NOT NULL,
    "specialistId" text NOT NULL,
    "certificationName" text NOT NULL,
    "issuingOrganization" text NOT NULL,
    "issueDate" timestamp(3) without time zone NOT NULL,
    "expiryDate" timestamp(3) without time zone,
    "verificationStatus" text NOT NULL,
    "certificateUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SpecialistCertification" OWNER TO postgres;

--
-- Name: SpecialistLocation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SpecialistLocation" (
    id text NOT NULL,
    "specialistId" text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    status text NOT NULL,
    heading double precision,
    accuracy double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SpecialistLocation" OWNER TO postgres;

--
-- Name: SpecialistProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SpecialistProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "businessName" text,
    "businessDescription" text,
    "yearsOfExperience" integer,
    address text,
    city text,
    state text,
    "zipCode" text,
    country text,
    latitude double precision,
    longitude double precision,
    "serviceRadius" integer,
    "availabilityStatus" text DEFAULT 'offline'::text NOT NULL,
    "hourlyRate" numeric(10,2),
    "isFeatured" boolean DEFAULT false NOT NULL,
    "averageRating" numeric(3,2),
    "totalReviews" integer DEFAULT 0 NOT NULL,
    "totalJobsCompleted" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "acceptsDigitalPayment" boolean DEFAULT true NOT NULL,
    "avgDeliveryTime" integer,
    "businessLicense" text,
    "cancellationRate" numeric(5,2),
    "completionRate" numeric(5,2),
    currency text DEFAULT 'USD'::text NOT NULL,
    education jsonb,
    "emergencyAvailable" boolean DEFAULT false NOT NULL,
    "insuranceInfo" text,
    "isBackgroundChecked" boolean DEFAULT false NOT NULL,
    "isIdentityVerified" boolean DEFAULT false NOT NULL,
    "isInsuranceVerified" boolean DEFAULT false NOT NULL,
    "isLicenseVerified" boolean DEFAULT false NOT NULL,
    "isProfileComplete" boolean DEFAULT false NOT NULL,
    languages text[],
    "minimumJobPrice" numeric(10,2),
    "positiveReviewPercentage" numeric(5,2),
    "preferredJobSizes" text[],
    "preferredJobTypes" text[],
    "responseTime" integer,
    tagline text,
    "travelWillingness" boolean DEFAULT false NOT NULL,
    "workHistory" jsonb
);


ALTER TABLE public."SpecialistProfile" OWNER TO postgres;

--
-- Name: SpecialistService; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SpecialistService" (
    id text NOT NULL,
    "specialistId" text NOT NULL,
    "serviceCategoryId" text NOT NULL,
    "priceType" text NOT NULL,
    "basePrice" numeric(10,2),
    description text,
    "isPrimary" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SpecialistService" OWNER TO postgres;

--
-- Name: SystemSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemSetting" (
    id text NOT NULL,
    "settingKey" text NOT NULL,
    "settingValue" jsonb NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SystemSetting" OWNER TO postgres;

--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    "walletId" text NOT NULL,
    "jobId" text,
    "transactionType" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    "feeAmount" numeric(10,2) DEFAULT 0 NOT NULL,
    status text NOT NULL,
    "paymentMethod" text,
    "paymentProviderReference" text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public."Transaction" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."UserRole" DEFAULT 'CUSTOMER'::public."UserRole" NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    phone text,
    "profileImageUrl" text,
    "dateOfBirth" timestamp(3) without time zone,
    bio text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLogin" timestamp(3) without time zone,
    "isVerified" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "phoneVerified" boolean DEFAULT false NOT NULL,
    "twoFactorEnabled" boolean DEFAULT false NOT NULL,
    "notificationPreferences" jsonb
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserBadge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserBadge" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "badgeId" text NOT NULL,
    "awardedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserBadge" OWNER TO postgres;

--
-- Name: UserDevice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserDevice" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "deviceToken" text,
    "deviceType" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deviceName" text,
    "lastActive" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserDevice" OWNER TO postgres;

--
-- Name: UserPreference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserPreference" (
    id text NOT NULL,
    "userId" text NOT NULL,
    preferences jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserPreference" OWNER TO postgres;

--
-- Name: UserSkill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserSkill" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "skillId" text NOT NULL,
    "proficiencyLevel" integer DEFAULT 1,
    "yearsExperience" numeric(4,1),
    "isVerified" boolean DEFAULT false NOT NULL,
    "endorsementCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserSkill" OWNER TO postgres;

--
-- Name: UserSocialLink; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserSocialLink" (
    id text NOT NULL,
    "userId" text NOT NULL,
    platform text NOT NULL,
    url text NOT NULL,
    username text,
    "isVerified" boolean DEFAULT false NOT NULL,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserSocialLink" OWNER TO postgres;

--
-- Name: Wallet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wallet" (
    id text NOT NULL,
    "userId" text NOT NULL,
    balance numeric(10,2) DEFAULT 0 NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Wallet" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: AssistantAnalytics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AssistantAnalytics" (id, "userId", date, "totalInteractions", "suggestionsShown", "suggestionsAccepted", "suggestionsDismissed", "manualQueries", "modeChanges", "timeSpentSeconds", "mostUsedMode") FROM stdin;
\.


--
-- Data for Name: AssistantMemoryLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AssistantMemoryLog" (id, "userId", mode, "interactionType", context, "routePath", "createdAt") FROM stdin;
\.


--
-- Data for Name: AssistantPreference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AssistantPreference" (id, "userId", "isEnabled", "proactivityLevel", "preferredModes", "dismissedSuggestions", "lastInteraction", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AssistantSuggestion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AssistantSuggestion" (id, "userId", mode, title, description, "actionType", "actionPayload", priority, status, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Badge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Badge" (id, name, description, "iconUrl", criteria, category, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CustomerProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CustomerProfile" (id, "userId", address, city, state, "zipCode", country, latitude, longitude, "preferredCommunication", "savedPaymentMethods", "createdAt", "updatedAt") FROM stdin;
876d211e-e713-43d5-bcb2-23e037348808	1daf8d2e-73b6-4425-9a2f-3a0c6ee2f1ca	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-13 09:11:08.599	2025-06-13 09:11:08.599
6d577e0a-e62b-49f9-8cd9-98d282622538	807667b2-fe54-4a0a-86b8-0c931c96d535	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-13 12:17:19.409	2025-06-13 12:17:19.409
\.


--
-- Data for Name: Dispute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Dispute" (id, "jobId", "openedById", reason, status, resolution, "resolvedById", "createdAt", "updatedAt", "resolvedAt") FROM stdin;
\.


--
-- Data for Name: DisputeMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DisputeMessage" (id, "disputeId", "userId", message, "attachmentUrl", "createdAt") FROM stdin;
\.


--
-- Data for Name: Guild; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Guild" (id, name, description, "logoUrl", "founderId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: GuildMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GuildMember" (id, "guildId", "userId", role, "joinedAt") FROM stdin;
\.


--
-- Data for Name: Job; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Job" (id, title, description, "customerId", "serviceCategoryId", status, latitude, longitude, address, city, state, "zipCode", country, "scheduledStartTime", "scheduledEndTime", "estimatedDuration", "budgetMin", "budgetMax", "finalPrice", "urgencyLevel", "specialistId", "isRemote", "createdAt", "updatedAt", "completedAt", "cancelledAt", "cancellationReason", "aiGeneratedTags") FROM stdin;
sample-job-1	Fix leaking kitchen sink	The kitchen sink has been leaking for a few days. Need someone to fix it as soon as possible.	1daf8d2e-73b6-4425-9a2f-3a0c6ee2f1ca	074b05b9-2909-4c8e-913c-a67878aac01b	OPEN	37.7749	-122.4194	123 Main St, San Francisco, CA 94105	San Francisco	\N	94105	USA	\N	\N	\N	80.00	120.00	\N	high	\N	f	2025-06-13 09:11:08.94	2025-06-13 09:11:08.94	\N	\N	\N	\N
sample-job-2	Install new ceiling light	Need to install a new ceiling light fixture in the living room. I have the fixture already.	1daf8d2e-73b6-4425-9a2f-3a0c6ee2f1ca	696ad67b-a80a-47bd-a99f-5d6a44a0514a	OPEN	37.7899	-122.4014	456 Market St, San Francisco, CA 94105	San Francisco	\N	94105	USA	\N	\N	\N	60.00	90.00	\N	medium	\N	f	2025-06-13 09:11:08.943	2025-06-13 09:11:08.943	\N	\N	\N	\N
\.


--
-- Data for Name: JobMedia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JobMedia" (id, "jobId", "mediaType", "mediaUrl", "thumbnailUrl", description, "aiAnalysis", "isBefore", "createdAt") FROM stdin;
\.


--
-- Data for Name: JobMilestone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JobMilestone" (id, "jobId", title, description, amount, status, "dueDate", "completedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: JobProposal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JobProposal" (id, "jobId", "specialistId", price, message, status, "estimatedStartTime", "estimatedDuration", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "jobId", "senderId", "recipientId", "messageType", content, "mediaUrl", "isRead", "createdAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "userId", type, title, message, data, "isRead", "createdAt") FROM stdin;
\.


--
-- Data for Name: PortfolioItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PortfolioItem" (id, "userId", title, description, "mediaUrls", "serviceCategoryId", "isPublic", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, "jobId", "reviewerId", "revieweeId", comment, response, "isPublic", "createdAt", "updatedAt", "communicationRating", "costRating", "editHistory", "helpfulCount", "isEdited", "isVerifiedPurchase", "overallRating", "reportCount", "reviewType", "satisfactionRating", "timingRating") FROM stdin;
\.


--
-- Data for Name: ReviewMedia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ReviewMedia" (id, "reviewId", "mediaUrl", "mediaType", "createdAt") FROM stdin;
\.


--
-- Data for Name: SearchHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SearchHistory" (id, "userId", query, filters, "resultsCount", "createdAt") FROM stdin;
\.


--
-- Data for Name: ServiceCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceCategory" (id, name, description, "iconUrl", "parentCategoryId", "isActive", "createdAt", "updatedAt", color, "coverImageUrl", "displayOrder", emoji, "isPopular", "metaTags", slug) FROM stdin;
074b05b9-2909-4c8e-913c-a67878aac01b	Plumbing	Plumbing services including repairs, installations, and maintenance	/icons/plumbing.svg	\N	t	2025-06-13 09:11:08.252	2025-06-13 09:11:08.252	\N	\N	0	\N	f	\N	\N
696ad67b-a80a-47bd-a99f-5d6a44a0514a	Electrical	Electrical services including wiring, installations, and repairs	/icons/electrical.svg	\N	t	2025-06-13 09:11:08.255	2025-06-13 09:11:08.255	\N	\N	0	\N	f	\N	\N
a4edc46e-0b89-4863-8b10-f5852541969e	Carpentry	Carpentry services including furniture assembly, repairs, and custom builds	/icons/carpentry.svg	\N	t	2025-06-13 09:11:08.257	2025-06-13 09:11:08.257	\N	\N	0	\N	f	\N	\N
3dfa8fd6-d01c-4cfd-8f3c-9d8a8b914ac2	Painting	Interior and exterior painting services	/icons/painting.svg	\N	t	2025-06-13 09:11:08.259	2025-06-13 09:11:08.259	\N	\N	0	\N	f	\N	\N
7b7265c3-14f6-4100-a374-f4733153fbd6	Cleaning	Cleaning services for homes and offices	/icons/cleaning.svg	\N	t	2025-06-13 09:11:08.261	2025-06-13 09:11:08.261	\N	\N	0	\N	f	\N	\N
5301f446-6a48-444d-af30-9bc9385a1134	Gardening	Gardening and landscaping services	/icons/gardening.svg	\N	t	2025-06-13 09:11:08.264	2025-06-13 09:11:08.264	\N	\N	0	\N	f	\N	\N
34631bc1-d2e4-4119-b698-cb5eb47bf3cd	Moving	Moving and delivery services	/icons/moving.svg	\N	t	2025-06-13 09:11:08.267	2025-06-13 09:11:08.267	\N	\N	0	\N	f	\N	\N
1b56cfc8-8226-42c3-9f49-b49a98b9cd9d	Appliance Repair	Repair services for home appliances	/icons/appliance.svg	\N	t	2025-06-13 09:11:08.27	2025-06-13 09:11:08.27	\N	\N	0	\N	f	\N	\N
4636d01c-a179-4d13-9e30-094feea09516	HVAC	Heating, ventilation, and air conditioning services	/icons/hvac.svg	\N	t	2025-06-13 09:11:08.272	2025-06-13 09:11:08.272	\N	\N	0	\N	f	\N	\N
18989184-84c6-4a0c-b979-27a25ed855e3	Roofing	Roofing installation and repair services	/icons/roofing.svg	\N	t	2025-06-13 09:11:08.274	2025-06-13 09:11:08.274	\N	\N	0	\N	f	\N	\N
\.


--
-- Data for Name: Skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Skill" (id, name, description, "iconUrl", "serviceCategoryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SkillEndorsement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SkillEndorsement" (id, "userSkillId", "endorserId", comment, "createdAt") FROM stdin;
\.


--
-- Data for Name: SpecialistAvailability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SpecialistAvailability" (id, "specialistId", "dayOfWeek", "startTime", "endTime", "isAvailable", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SpecialistCertification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SpecialistCertification" (id, "specialistId", "certificationName", "issuingOrganization", "issueDate", "expiryDate", "verificationStatus", "certificateUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SpecialistLocation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SpecialistLocation" (id, "specialistId", latitude, longitude, status, heading, accuracy, "createdAt") FROM stdin;
\.


--
-- Data for Name: SpecialistProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SpecialistProfile" (id, "userId", "businessName", "businessDescription", "yearsOfExperience", address, city, state, "zipCode", country, latitude, longitude, "serviceRadius", "availabilityStatus", "hourlyRate", "isFeatured", "averageRating", "totalReviews", "totalJobsCompleted", "createdAt", "updatedAt", "acceptsDigitalPayment", "avgDeliveryTime", "businessLicense", "cancellationRate", "completionRate", currency, education, "emergencyAvailable", "insuranceInfo", "isBackgroundChecked", "isIdentityVerified", "isInsuranceVerified", "isLicenseVerified", "isProfileComplete", languages, "minimumJobPrice", "positiveReviewPercentage", "preferredJobSizes", "preferredJobTypes", "responseTime", tagline, "travelWillingness", "workHistory") FROM stdin;
77934cf5-3eb3-46a0-850c-9573ddc4799c	870506be-a52b-4db8-872c-a3775eebd68f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	available	\N	f	\N	0	0	2025-06-13 09:11:08.927	2025-06-13 09:11:08.927	t	\N	\N	\N	\N	USD	\N	f	\N	f	f	f	f	f	\N	\N	\N	\N	\N	\N	\N	f	\N
\.


--
-- Data for Name: SpecialistService; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SpecialistService" (id, "specialistId", "serviceCategoryId", "priceType", "basePrice", description, "isPrimary", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SystemSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SystemSetting" (id, "settingKey", "settingValue", description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transaction" (id, "walletId", "jobId", "transactionType", amount, "feeAmount", status, "paymentMethod", "paymentProviderReference", description, "createdAt", "updatedAt", "completedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, "passwordHash", role, "firstName", "lastName", phone, "profileImageUrl", "dateOfBirth", bio, "createdAt", "updatedAt", "lastLogin", "isVerified", "isActive", "emailVerified", "phoneVerified", "twoFactorEnabled", "notificationPreferences") FROM stdin;
27731f4d-3249-4ac4-8e46-db1213709949	admin@jobmate.com	$2a$12$9HIjdwezyeaJArahPsjZSuyCVBcaGw9ZOvm89QiIWpnNeGC6rOVKW	ADMIN	Admin	User	\N	\N	\N	\N	2025-06-13 09:11:08.243	2025-06-13 09:11:08.243	\N	t	t	t	f	f	\N
1daf8d2e-73b6-4425-9a2f-3a0c6ee2f1ca	customer@example.com	$2a$12$4GqGToiFaPJNskt7HY4N5.B1tYrmiNyrpJyia211IQNSg0WMxU4RG	CUSTOMER	Demo	Customer	\N	\N	\N	\N	2025-06-13 09:11:08.59	2025-06-13 09:11:08.59	\N	t	t	t	f	f	\N
870506be-a52b-4db8-872c-a3775eebd68f	specialist@example.com	$2a$12$IZT9kZyNmy2QdzLIp4KLletGM1baT8butDUG9yITLVUuzHBRSbE6O	SPECIALIST	Demo	Specialist	\N	\N	\N	\N	2025-06-13 09:11:08.919	2025-06-13 09:11:08.919	\N	t	t	t	f	f	\N
807667b2-fe54-4a0a-86b8-0c931c96d535	junginu763@gmail.com	$2a$12$W/F8zvUwUVaKuo1MO6ZnN.rQ2Yp0EmDHFE1j1oa6nuVatpyqWpDdy	CUSTOMER	Jung	Inu	\N	\N	\N	\N	2025-06-13 12:17:19.357	2025-06-13 12:17:20.098	2025-06-13 12:17:20.097	f	t	f	f	f	\N
\.


--
-- Data for Name: UserBadge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserBadge" (id, "userId", "badgeId", "awardedAt") FROM stdin;
\.


--
-- Data for Name: UserDevice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserDevice" (id, "userId", "deviceToken", "deviceType", "createdAt", "deviceName", "lastActive", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserPreference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserPreference" (id, "userId", preferences, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserSkill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserSkill" (id, "userId", "skillId", "proficiencyLevel", "yearsExperience", "isVerified", "endorsementCount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserSocialLink; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserSocialLink" (id, "userId", platform, url, username, "isVerified", "isPublic", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Wallet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Wallet" (id, "userId", balance, currency, "isActive", "createdAt", "updatedAt") FROM stdin;
ba6cfa2c-0edd-41ae-b173-fd0e4e16ec09	1daf8d2e-73b6-4425-9a2f-3a0c6ee2f1ca	500.00	USD	t	2025-06-13 09:11:08.931	2025-06-13 09:11:08.931
3a17da4d-5733-4030-a23f-54fe7f8c91de	870506be-a52b-4db8-872c-a3775eebd68f	1000.00	USD	t	2025-06-13 09:11:08.935	2025-06-13 09:11:08.935
05accbf8-230e-416b-aff9-fa01dcbeb624	807667b2-fe54-4a0a-86b8-0c931c96d535	0.00	USD	t	2025-06-13 12:17:19.455	2025-06-13 12:17:19.455
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0b20c55e-c522-40c1-891e-19c18b7ea462	beac485d7779ba1715742fe362ef889cf7cf563a1f53888b4a2771216d0865fb	2025-06-13 11:50:13.430976+03	20250613085013_init	\N	\N	2025-06-13 11:50:13.276506+03	1
\.


--
-- Name: AssistantAnalytics AssistantAnalytics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssistantAnalytics"
    ADD CONSTRAINT "AssistantAnalytics_pkey" PRIMARY KEY (id);


--
-- Name: AssistantMemoryLog AssistantMemoryLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssistantMemoryLog"
    ADD CONSTRAINT "AssistantMemoryLog_pkey" PRIMARY KEY (id);


--
-- Name: AssistantPreference AssistantPreference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssistantPreference"
    ADD CONSTRAINT "AssistantPreference_pkey" PRIMARY KEY (id);


--
-- Name: AssistantSuggestion AssistantSuggestion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssistantSuggestion"
    ADD CONSTRAINT "AssistantSuggestion_pkey" PRIMARY KEY (id);


--
-- Name: Badge Badge_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Badge"
    ADD CONSTRAINT "Badge_pkey" PRIMARY KEY (id);


--
-- Name: CustomerProfile CustomerProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomerProfile"
    ADD CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY (id);


--
-- Name: DisputeMessage DisputeMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DisputeMessage"
    ADD CONSTRAINT "DisputeMessage_pkey" PRIMARY KEY (id);


--
-- Name: Dispute Dispute_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Dispute"
    ADD CONSTRAINT "Dispute_pkey" PRIMARY KEY (id);


--
-- Name: GuildMember GuildMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GuildMember"
    ADD CONSTRAINT "GuildMember_pkey" PRIMARY KEY (id);


--
-- Name: Guild Guild_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guild"
    ADD CONSTRAINT "Guild_pkey" PRIMARY KEY (id);


--
-- Name: JobMedia JobMedia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobMedia"
    ADD CONSTRAINT "JobMedia_pkey" PRIMARY KEY (id);


--
-- Name: JobMilestone JobMilestone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobMilestone"
    ADD CONSTRAINT "JobMilestone_pkey" PRIMARY KEY (id);


--
-- Name: JobProposal JobProposal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobProposal"
    ADD CONSTRAINT "JobProposal_pkey" PRIMARY KEY (id);


--
-- Name: Job Job_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: PortfolioItem PortfolioItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortfolioItem"
    ADD CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY (id);


--
-- Name: ReviewMedia ReviewMedia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReviewMedia"
    ADD CONSTRAINT "ReviewMedia_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: SearchHistory SearchHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SearchHistory"
    ADD CONSTRAINT "SearchHistory_pkey" PRIMARY KEY (id);


--
-- Name: ServiceCategory ServiceCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCategory"
    ADD CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY (id);


--
-- Name: SkillEndorsement SkillEndorsement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillEndorsement"
    ADD CONSTRAINT "SkillEndorsement_pkey" PRIMARY KEY (id);


--
-- Name: Skill Skill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_pkey" PRIMARY KEY (id);


--
-- Name: SpecialistAvailability SpecialistAvailability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialistAvailability"
    ADD CONSTRAINT "SpecialistAvailability_pkey" PRIMARY KEY (id);


--
-- Name: SpecialistCertification SpecialistCertification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialistCertification"
    ADD CONSTRAINT "SpecialistCertification_pkey" PRIMARY KEY (id);


--
-- Name: SpecialistLocation SpecialistLocation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialistLocation"
    ADD CONSTRAINT "SpecialistLocation_pkey" PRIMARY KEY (id);


--
-- Name: SpecialistProfile SpecialistProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialistProfile"
    ADD CONSTRAINT "SpecialistProfile_pkey" PRIMARY KEY (id);


--
-- Name: SpecialistService SpecialistService_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialistService"
    ADD CONSTRAINT "SpecialistService_pkey" PRIMARY KEY (id);


--
-- Name: SystemSetting SystemSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemSetting"
    ADD CONSTRAINT "SystemSetting_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: UserBadge UserBadge_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserBadge"
    ADD CONSTRAINT "UserBadge_pkey" PRIMARY KEY (id);


--
-- Name: UserDevice UserDevice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserDevice"
    ADD CONSTRAINT "UserDevice_pkey" PRIMARY KEY (id);


--
-- Name: UserPreference UserPreference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserPreference"
    ADD CONSTRAINT "UserPreference_pkey" PRIMARY KEY (id);


--
-- Name: UserSkill UserSkill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSkill"
    ADD CONSTRAINT "UserSkill_pkey" PRIMARY KEY (id);


--
-- Name: UserSocialLink UserSocialLink_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSocialLink"
    ADD CONSTRAINT "UserSocialLink_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Wallet Wallet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AssistantAnalytics_userId_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AssistantAnalytics_userId_date_key" ON public."AssistantAnalytics" USING btree ("userId", date);


--
-- Name: AssistantPreference_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AssistantPreference_userId_key" ON public."AssistantPreference" USING btree ("userId");


--
-- Name: CustomerProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON public."CustomerProfile" USING btree ("userId");


--
-- Name: GuildMember_guildId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "GuildMember_guildId_userId_key" ON public."GuildMember" USING btree ("guildId", "userId");


--
-- Name: ServiceCategory_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON public."ServiceCategory" USING btree (slug);


--
-- Name: SpecialistProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SpecialistProfile_userId_key" ON public."SpecialistProfile" USING btree ("userId");


--
-- Name: SystemSetting_settingKey_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SystemSetting_settingKey_key" ON public."SystemSetting" USING btree ("settingKey");


--
-- Name: UserBadge_userId_badgeId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON public."UserBadge" USING btree ("userId", "badgeId");


--
-- Name: UserPreference_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserPreference_userId_key" ON public."UserPreference" USING btree ("userId");


--
-- Name: UserSkill_userId_skillId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserSkill_userId_skillId_key" ON public."UserSkill" USING btree ("userId", "skillId");


--
-- Name: UserSocialLink_userId_platform_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserSocialLink_userId_platform_key" ON public."UserSocialLink" USING btree ("userId", platform);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Wallet_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Wallet_userId_key" ON public."Wallet" USING btree ("userId");


--
-- Name: AssistantAnalytics AssistantAnalytics_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssistantAnalytics"
    ADD CONSTRAINT "AssistantAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssistantMemoryLog AssistantMemoryLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssistantMemoryLog"
    ADD CONSTRAINT "AssistantMemoryLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssistantPreference AssistantPreference_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssistantPreference"
    ADD CONSTRAINT "AssistantPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssistantSuggestion AssistantSuggestion_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssistantSuggestion"
    ADD CONSTRAINT "AssistantSuggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CustomerProfile CustomerProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomerProfile"
    ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DisputeMessage DisputeMessage_disputeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DisputeMessage"
    ADD CONSTRAINT "DisputeMessage_disputeId_fkey" FOREIGN KEY ("disputeId") REFERENCES public."Dispute"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DisputeMessage DisputeMessage_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DisputeMessage"
    ADD CONSTRAINT "DisputeMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Dispute Dispute_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Dispute"
    ADD CONSTRAINT "Dispute_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Dispute Dispute_openedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Dispute"
    ADD CONSTRAINT "Dispute_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Dispute Dispute_resolvedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Dispute"
    ADD CONSTRAINT "Dispute_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: GuildMember GuildMember_guildId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GuildMember"
    ADD CONSTRAINT "GuildMember_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES public."Guild"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GuildMember GuildMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GuildMember"
    ADD CONSTRAINT "GuildMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Guild Guild_founderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guild"
    ADD CONSTRAINT "Guild_founderId_fkey" FOREIGN KEY ("founderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JobMedia JobMedia_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobMedia"
    ADD CONSTRAINT "JobMedia_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JobMilestone JobMilestone_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobMilestone"
    ADD CONSTRAINT "JobMilestone_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JobProposal JobProposal_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobProposal"
    ADD CONSTRAINT "JobProposal_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JobProposal JobProposal_specialistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobProposal"
    ADD CONSTRAINT "JobProposal_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Job Job_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Job Job_serviceCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES public."ServiceCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Job Job_specialistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Message Message_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Message Message_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PortfolioItem PortfolioItem_serviceCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortfolioItem"
    ADD CONSTRAINT "PortfolioItem_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES public."ServiceCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PortfolioItem PortfolioItem_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PortfolioItem"
    ADD CONSTRAINT "PortfolioItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ReviewMedia ReviewMedia_reviewId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReviewMedia"
    ADD CONSTRAINT "ReviewMedia_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES public."Review"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_revieweeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_reviewerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SearchHistory SearchHistory_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SearchHistory"
    ADD CONSTRAINT "SearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceCategory ServiceCategory_parentCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCategory"
    ADD CONSTRAINT "ServiceCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES public."ServiceCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SkillEndorsement SkillEndorsement_endorserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillEndorsement"
    ADD CONSTRAINT "SkillEndorsement_endorserId_fkey" FOREIGN KEY ("endorserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SkillEndorsement SkillEndorsement_userSkillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillEndorsement"
    ADD CONSTRAINT "SkillEndorsement_userSkillId_fkey" FOREIGN KEY ("userSkillId") REFERENCES public."UserSkill"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Skill Skill_serviceCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES public."ServiceCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SpecialistAvailability SpecialistAvailability_specialistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialistAvailability"
    ADD CONSTRAINT "SpecialistAvailability_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES public."SpecialistProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SpecialistCertification SpecialistCertification_specialistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialistCertification"
    ADD CONSTRAINT "SpecialistCertification_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES public."SpecialistProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SpecialistLocation SpecialistLocation_specialistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialistLocation"
    ADD CONSTRAINT "SpecialistLocation_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES public."SpecialistProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SpecialistProfile SpecialistProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialistProfile"
    ADD CONSTRAINT "SpecialistProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SpecialistService SpecialistService_serviceCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialistService"
    ADD CONSTRAINT "SpecialistService_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES public."ServiceCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SpecialistService SpecialistService_specialistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialistService"
    ADD CONSTRAINT "SpecialistService_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES public."SpecialistProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Transaction Transaction_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_walletId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES public."Wallet"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserBadge UserBadge_badgeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserBadge"
    ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES public."Badge"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserBadge UserBadge_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserBadge"
    ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserDevice UserDevice_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserDevice"
    ADD CONSTRAINT "UserDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserPreference UserPreference_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserPreference"
    ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSkill UserSkill_skillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSkill"
    ADD CONSTRAINT "UserSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES public."Skill"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSkill UserSkill_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSkill"
    ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSocialLink UserSocialLink_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSocialLink"
    ADD CONSTRAINT "UserSocialLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Wallet Wallet_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

