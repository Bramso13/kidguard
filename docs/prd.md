# KidGuard Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Transform screen time management from parent-child conflict to positive educational engagement
- Enable automatic enforcement of screen time limits without parental supervision burden
- Provide children with playful, AI-generated learning exercises that feel like games, not homework
- Allow parents to safely share their phones with children through one-tap mode switching
- Deliver age-appropriate French educational content aligned with curriculum standards
- Achieve sustainable 30+ day family adoption proving real behavioral change
- Validate French market viability before international expansion

### Background Context

Children ages 6-14 are spending 4-7 hours daily on screens, creating constant family conflict and parental anxiety about developmental impacts. Existing solutions (iOS Screen Time, Google Family Link) are purely restrictive, generating resentment without educational value. Educational apps require parental enforcement that children resist. KidGuard addresses this gap by making screen time access contingent on completing fun, AI-generated exercises. The app disguises learning as play, aligning with children's intrinsic motivation (device access) while delivering parental goals (reduced conflict, educational engagement).

The French market is our initial focus, with parents often sharing their own smartphones with children during controlled usage periods. The parent phone sharing mode is a critical MVP feature addressing this common behavior. The technical stack—Expo, DeepSeek AI, Better Auth—is optimized for cost-effective MVP development with a 3-4 month timeline targeting 10,000 users within 6 months of launch.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-03 | 1.0 | Initial PRD creation from Project Brief | John (PM) |

---

## Requirements

### Functional

**FR1:** The system shall provide a parent control panel where parents can create and manage multiple child profiles with individual settings (exercise types, difficulty levels, time rewards per exercise).

**FR2:** The system shall provide a one-tap "Parent Phone Sharing Mode" button with child name that transitions the parent's device into child-locked mode, blocking configured apps until exercises are completed.

**FR3:** The system shall allow parents to return from child mode to parent mode via secure PIN authentication.

**FR4:** The system shall block access to configured apps on the child's device (or parent's device in sharing mode) when screen time is depleted.

**FR5:** The system shall intercept app access attempts and present a playful, gamified exercise challenge before allowing access.

**FR6:** The system shall integrate with DeepSeek AI to generate varied, age-appropriate exercises in French across multiple categories (math, reading, logic, vocabulary, memory games).

**FR7:** The system shall ensure generated exercises do not repeat within a reasonable timeframe to prevent memorization.

**FR8:** The system shall use DeepSeek AI to validate child answers in real-time, handling multiple answer formats (typed text, multiple choice, voice input for younger children).

**FR9:** The system shall provide age-appropriate leniency in answer validation, accounting for spelling variations, synonyms, partial correctness, and different valid formats.

**FR10:** The system shall unlock screen time for the parent-configured duration (e.g., 15 minutes) upon successful exercise completion.

**FR11:** The system shall display a kid-friendly exercise interface with colorful visuals, animations, and immediate feedback (success celebrations, encouraging messages on mistakes).

**FR12:** The system shall provide all UI, exercises, and content in French language for MVP.

**FR13:** The system shall implement basic gamification features including points/stars per completed exercise, simple progress tracking, and visual "time bank" showing earned screen time.

**FR14:** The system shall provide a parent monitoring dashboard showing child activity (exercises completed, subjects practiced, screen time earned/used, basic performance trends).

**FR15:** The system shall support quick switching between multiple child profiles when parents are sharing their phone.

**FR16:** The system shall implement secure parent authentication using Better Auth with email/password.

**FR17:** The system shall create child profiles without requiring credentials (device-based access).

**FR18:** The system shall protect sensitive settings changes with parental PIN authentication.

**FR19:** The system shall allow parents to configure which apps are blocked during child mode.

**FR20:** The system shall display exercise loading within 2 seconds of lock trigger to challenge display.

**FR21:** The system shall complete AI response validation within 3 seconds of answer submission.

**FR22:** The system shall queue up to 5 pre-generated exercises for brief connectivity loss scenarios.

### Non-Functional

**NFR1:** The system shall maintain 60fps UI animations for gamified elements to ensure smooth, engaging experience.

**NFR2:** The system shall achieve 95%+ accuracy in AI answer validation across diverse answer formats and age groups.

**NFR3:** The system shall ensure AI-generated French exercises have <5% parent-reported quality issues.

**NFR4:** The system shall support iOS 15.1+ as minimum OS version (required for Device Activity APIs).

**NFR5:** The system shall support iPhone and iPad devices.

**NFR6:** The system shall comply with GDPR-K (children's data privacy under GDPR) requirements for apps targeting children under 13.

**NFR7:** The system shall encrypt all data at rest and in transit using TLS/SSL.

**NFR8:** The system shall prevent bypass mechanisms (device factory reset, app deletion) from circumventing parental controls through OS-level integration.

**NFR9:** The system shall maintain cost-effective AI usage through DeepSeek API to ensure sustainable unit economics at scale.

**NFR10:** The system shall be completable for setup and configuration by parents in under 10 minutes.

**NFR11:** The system shall achieve 70%+ child exercise completion rate (children not abandoning in frustration).

**NFR12:** The system shall support concurrent users and real-time validations at scale through EAS backend infrastructure.

**NFR13:** The system shall implement content filtering to ensure DeepSeek-generated exercises are age-appropriate and safe.

**NFR14:** The system shall integrate react-native-device-activity library for app blocking using Apple's Device Activity framework with Family Controls entitlement.

**NFR15:** The system shall handle DeepSeek API service unavailability through pre-generated exercise bank fallback mechanisms.

**NFR16:** The system shall limit concurrent child monitoring sessions to 20 to respect Device Activity API constraints.

---

## User Interface Design Goals

### Overall UX Vision

KidGuard delivers two distinct but complementary user experiences:

**Parent Experience:** Clean, confident, control-focused interface that prioritizes ease of setup and peace of mind. Parents should feel empowered, not overwhelmed. Dashboard provides at-a-glance confirmation that the system is working without requiring deep engagement. The phone sharing mode transition should be instant and obvious, with clear visual feedback confirming child mode is active.

**Child Experience:** Vibrant, playful, game-like interface that makes exercise challenges feel like mini-games, not schoolwork. Every interaction rewards progress with visual celebrations, encouraging animations, and positive reinforcement. The experience should feel fair and achievable, motivating children to engage willingly rather than resist.

### Key Interaction Paradigms

- **One-Tap Mode Switching:** Large, prominent "[Child Name] will use this phone" button with clear visual state change (e.g., color shift, lock icon) confirming transition to child mode
- **Exercise-as-Game:** Challenges presented as colorful, animated puzzles with countdown timers, progress bars, and instant feedback
- **Positive Reinforcement Loop:** Success triggers celebrations (confetti animations, achievement sounds, star rewards); mistakes trigger gentle encouragement ("Almost! Try again!")
- **Visual Time Banking:** Child can see their earned screen time accumulating in a visual "bank" (e.g., filling hourglass, growing tree) providing tangible sense of accomplishment
- **Minimal Friction:** Parent setup uses smart defaults and age-based presets to minimize configuration decisions
- **PIN-Protected Actions:** All sensitive parent functions (exit child mode, change settings) require PIN entry with numeric keypad

### Core Screens and Views

**Parent Screens:**
1. Parent Login/Registration Screen
2. Parent Dashboard (overview of all children, recent activity, quick stats)
3. Child Profile Management Screen (add/edit child profiles)
4. Settings Screen (configure exercise types, difficulty, time rewards, blocked apps)
5. Phone Sharing Mode Button (prominent on parent dashboard)
6. Child Activity Detail Screen (deep dive into specific child's progress)
7. PIN Entry Screen (for secure actions)

**Child Screens:**
1. Exercise Challenge Screen (main playful interface with exercise content)
2. Time Bank Screen (visual display of earned/remaining screen time)
3. Success Celebration Screen (post-exercise completion animation)
4. Progress Tracker Screen (simple view of points/stars earned)

**Shared/Transition:**
1. Mode Transition Screen (visual confirmation when switching to/from child mode)

### Accessibility: WCAG AA

The MVP will target **WCAG AA** compliance for:
- Sufficient color contrast for readability (critical for children and parents)
- Text resizing support for parents with vision needs
- Clear touch targets (minimum 44x44pt) appropriate for children's motor skills
- Screen reader support for parent-facing interfaces

Child-facing interfaces will prioritize visual clarity and large, obvious interactive elements over strict accessibility standards in MVP, with full accessibility planned for Phase 2.

### Branding

**Color Palette:**
- Parent mode: Calming blues and greens suggesting trust, control, peace of mind
- Child mode: Bright, energetic colors (yellows, oranges, purples) suggesting fun and playfulness
- Clear visual distinction between modes to prevent confusion

**Tone:**
- Parent-facing: Professional, reassuring, data-informed
- Child-facing: Playful, encouraging, celebratory

**Visual Style:**
- Rounded corners, friendly illustrations, approachable typography
- French language throughout with culturally appropriate visual references
- Avoid overly "babyish" design (respects 6-14 age range, especially older children)

### Target Device and Platforms: Mobile Only (iOS)

- **iOS-first:** iPhone and iPad support
- **Responsive design** adapting to different screen sizes (iPhone SE to iPad Pro)
- **Portrait-primary orientation** with landscape support for iPad exercises
- **Native iOS design patterns** (follows iOS Human Interface Guidelines for familiarity)
- **Touch-optimized interactions** (swipe gestures, tap targets, haptic feedback)

Android support deferred to Phase 2 after iOS market validation.

---

## Technical Assumptions

### Repository Structure: Monorepo

The project will use a **monorepo structure** with Expo's integrated API routes pattern:

- **Single Expo app** with backend API routes co-located
- **Expo API Routes** pattern: Backend endpoints defined in `app/api/` directory using `+api.ts` suffix (e.g., `app/api/exercise/generate+api.ts`)
- **Shared TypeScript types** between frontend and API routes ensure type safety across full stack
- **Simplified architecture** - No separate backend service, all backend logic lives within Expo app
- **Expo Router handles both** UI routes and API routes seamlessly

**Structure:**
```
/app
  /api
    /auth
      [...auth]+api.ts (Better Auth endpoints)
    /exercise
      /generate+api.ts (DeepSeek exercise generation)
      /validate+api.ts (DeepSeek answer validation)
    /child
      /profile+api.ts (Child profile management)
      /activity+api.ts (Activity tracking)
    /parent
      /dashboard+api.ts (Parent dashboard data)
  /(parent) (Parent UI screens)
  /(child) (Child UI screens)
/lib
  /services (Business logic, DeepSeek integration, etc.)
  /types (Shared TypeScript types)
  /utils (Common utilities)
```

**Rationale:** Expo's built-in API routes eliminate need for separate backend deployment, simplifying architecture and reducing infrastructure complexity for MVP.

### Service Architecture

**Expo App with integrated API routes:**

- **Single Expo application** serving both mobile UI and backend API
- **API routes** (`+api.ts` files) handle all backend logic:
  - Auth Service (Better Auth integration)
  - Exercise Generation Service (DeepSeek AI integration)
  - Validation Service (DeepSeek answer checking)
  - Lock Management Service (device state tracking)
  - Analytics Service (usage metrics)
- **Deployed to EAS** as single unified application
- **No separate backend server** - everything runs within Expo ecosystem

**Rationale:** Expo's API routes pattern is perfect for MVP - zero backend complexity, single deployment, full-stack in one codebase.

### Testing Requirements

**Unit + Integration testing strategy:**

- **Unit Tests:**
  - Core business logic (exercise validation rules, time calculation, etc.)
  - Utility functions and shared code
  - DeepSeek prompt templates and response parsing
  - Target: 70%+ code coverage for critical paths

- **Integration Tests:**
  - API routes (exercise generation, validation, auth flows)
  - DeepSeek API integration (mock responses for cost control)
  - Better Auth integration
  - Database operations (PostgreSQL queries)

- **Manual Testing:**
  - iOS device testing (iPhone, iPad physical devices)
  - Parent and child user flows
  - Phone sharing mode transitions
  - Exercise UI/UX and animations
  - French language content quality

- **E2E Testing (Phase 2):**
  - Deferred to post-MVP to prioritize launch speed
  - Critical user journeys will be manually tested pre-launch

**Testing Tools:**
- Jest for unit and integration tests
- React Native Testing Library for component tests
- Expo's testing infrastructure
- Manual testing checklist for pre-release validation

**Rationale:** Balanced approach prioritizes critical business logic testing while deferring expensive E2E automation until product-market fit is validated. Manual testing acceptable for MVP given small team size.

### Additional Technical Assumptions and Requests

**AI Integration:**
- DeepSeek API will be accessed via REST API from API routes with proper error handling and retry logic
- Exercise caching strategy: Cache up to 10 exercises per child per subject in Redis to reduce API calls
- Fallback exercise bank: Pre-generate 100 exercises across all subjects/age groups for offline/API failure scenarios
- Prompt versioning: Store DeepSeek prompts in database for A/B testing and iteration without code deploys

**iOS Integration:**
- App blocking managed via react-native-device-activity library (https://github.com/kingstinct/react-native-device-activity)
- **CRITICAL DEPENDENCY:** Requires Apple "Family Controls (Distribution)" entitlement - approval process may take 1-2 weeks
- iOS 15.1+ minimum (Device Activity framework requirement)
- Expo workflow: Requires `npx expo prebuild` for native configuration
- Physical device mandatory for testing (simulator not supported)
- Maximum 20 simultaneous activity monitors (limit concurrent child sessions)
- **Known issue:** SwiftUI app selection view can be crash-prone - implement error handling
- Shield Configuration and Shield Action APIs for custom blocking UI

**Database Schema:**
- PostgreSQL primary database hosted on Supabase with Accelerate for connection pooling and edge caching
- Prisma ORM for type-safe database access and schema migrations
- Redis (Upstash or similar) for session management, exercise caching, and rate limiting
- Database migrations managed via Prisma Migrate
- Separate Prisma models for ParentUser, ChildProfile, Exercise, ExerciseHistory, FallbackExercise, ChildSession, ExerciseFeedback

**Security & Privacy:**
- GDPR-K compliant data handling: Minimal child data collection (no email, no direct identifiers)
- Parent email verification required for account creation
- Data encryption at rest (database level) and in transit (TLS/SSL)
- Parental consent workflow for child profile creation
- Data retention policy: Exercise history retained for 90 days, then aggregated

**Performance Optimizations:**
- Image assets optimized and served via CDN (Expo CDN or Cloudflare)
- Lottie animations for lightweight file sizes
- Lazy loading for non-critical screens
- Exercise pre-fetching when child mode is activated
- Background task for exercise cache refresh

**Deployment & DevOps:**
- EAS Build for iOS app compilation
- EAS Submit for App Store submission
- EAS Update for over-the-air updates (bug fixes, content changes without App Store review)
- GitHub Actions for CI/CD pipeline
- Sentry for error tracking and monitoring
- Branch strategy: main (production), develop (staging), feature branches

**Monitoring & Analytics:**
- Sentry for error tracking and crash reporting
- Expo Analytics or Mixpanel for user behavior tracking
- Custom analytics for exercise completion rates, validation accuracy, user retention
- DeepSeek API cost monitoring dashboard
- Performance monitoring (API response times, app load times)

**French Localization:**
- i18n library (react-i18next) for string management
- French as default and only language for MVP
- DeepSeek prompts engineered specifically for French language generation
- French educational content validation by native speaker (QA requirement)
- Date/time formatting using French locale standards

---

## Epic List

**Epic 1: Foundation & Core Infrastructure**
Establish project setup with Expo, configure EAS, integrate Better Auth for parent authentication, set up PostgreSQL/Redis databases, and deploy a basic health check endpoint to validate the full stack is operational.

**Epic 2: Parent Profile & Child Management**
Enable parents to register, log in, create/manage multiple child profiles with individual settings (age, exercise preferences), and configure basic app blocking parameters.

**Epic 3: DeepSeek AI Exercise Generation & Validation**
Integrate DeepSeek API for French exercise generation across multiple subjects (math, reading, logic, vocabulary), implement answer validation with age-appropriate leniency, and create exercise caching/fallback mechanisms.

**Epic 4: Child Exercise Interface & Gamification**
Build the playful, kid-friendly exercise challenge screen with animations, immediate feedback, success celebrations, and basic gamification (points, time bank visualization).

**Epic 5: Phone Sharing Mode & Device Lock Integration**
Implement one-tap parent phone sharing mode with PIN-protected transitions, integrate react-native-device-activity for app blocking, and ensure reliable lock/unlock enforcement.

**Epic 6: Parent Monitoring Dashboard & Analytics**
Create parent dashboard showing child activity, exercise completion stats, screen time usage, and basic performance trends with French localization throughout.

---

## Epic 1: Foundation & Core Infrastructure

**Epic Goal:** Establish a fully functional Expo monorepo with EAS deployment pipeline, Better Auth integration for parent authentication, PostgreSQL/Redis databases, and a working health check API endpoint. This epic delivers the foundational infrastructure while proving the full stack is operational and deployable, setting the stage for all subsequent feature development.

### Story 1.1: Initialize Expo Project with Monorepo Structure

As a **developer**,
I want to create an Expo project with proper folder structure and tooling,
so that I have a solid foundation for building the mobile app and API routes.

**Acceptance Criteria:**
1. Expo project initialized with TypeScript and Expo Router
2. Folder structure created: `/app`, `/app/api`, `/lib/services`, `/lib/types`, `/lib/utils`
3. Package dependencies installed: Expo SDK, React Native, TypeScript, ESLint, Prettier
4. Git repository initialized with `.gitignore` configured for Expo/React Native
5. README.md created with project setup instructions
6. Development server runs successfully on local machine

### Story 1.2: Configure EAS Build and Deployment

As a **developer**,
I want to configure EAS for building and deploying the app,
so that I can automate builds and prepare for App Store submission.

**Acceptance Criteria:**
1. EAS CLI installed and authenticated
2. `eas.json` configuration file created with development, preview, and production build profiles
3. iOS build configuration set for iPhone/iPad with minimum iOS 15.1+
4. EAS Build successfully creates development build
5. EAS Submit configured for future App Store deployment
6. EAS Update configured for over-the-air updates

### Story 1.3: Set Up PostgreSQL Database with Supabase and Prisma

As a **developer**,
I want to provision a PostgreSQL database with Prisma ORM and Supabase Accelerate,
so that the app has persistent data storage with connection pooling and edge caching.

**Acceptance Criteria:**
1. Supabase project created with PostgreSQL database
2. Supabase Accelerate enabled for connection pooling
3. Prisma CLI installed and initialized in project
4. `schema.prisma` file created with initial User model for parent accounts
5. Database connection URL (Accelerate link) securely stored in `.env` file
6. Prisma Client generated and accessible throughout app
7. Initial migration created and applied: `prisma migrate dev --name init`
8. Database connection tested successfully from API route using Prisma Client
9. Redis instance configured (Upstash or Supabase-compatible provider) for session/exercise caching
10. `.env.example` file created documenting required environment variables

### Story 1.4: Integrate Better Auth for Parent Authentication

As a **developer**,
I want to integrate Better Auth for secure parent authentication,
so that parents can register and log in securely.

**Acceptance Criteria:**
1. Better Auth library installed and configured
2. Single API route created: `/app/api/auth/[...auth]+api.ts` that handles all auth endpoints automatically
3. Better Auth configuration file created with email/password provider
4. Database schema for Better Auth tables created via Prisma (User, Session, etc.)
5. Better Auth client hooks configured for React Native/Expo
6. Auth state persisted in app using Better Auth client
7. Email verification workflow configured
8. French language error messages configured in Better Auth options

### Story 1.5: Create Health Check API Endpoint

As a **developer**,
I want a health check API endpoint to verify the system is operational,
so that I can validate the full stack integration and monitor system status.

**Acceptance Criteria:**
1. API route created at `/app/api/health+api.ts`
2. Endpoint returns JSON response with status, timestamp, database connectivity, Redis connectivity
3. Database and Redis health checks included in response
4. Endpoint accessible via HTTP GET request
5. Response time logged for performance monitoring
6. Endpoint deployed successfully to EAS and accessible remotely

### Story 1.6: Set Up Error Tracking with Sentry

As a **developer**,
I want error tracking integrated from day one,
so that I can identify and fix bugs quickly in production.

**Acceptance Criteria:**
1. Sentry account created and project configured
2. Sentry SDK integrated in Expo app for mobile crash tracking
3. Sentry configured for API route error tracking
4. Test error triggered and visible in Sentry dashboard
5. Source maps uploaded to Sentry for readable stack traces
6. Error reporting respects user privacy (no sensitive data logged)

---

## Epic 2: Parent Profile & Child Management

**Epic Goal:** Enable parents to register, authenticate, and manage their account. Parents can create, edit, and delete child profiles with individual settings including age, exercise type preferences, difficulty levels, time reward configurations, and app blocking parameters. This epic delivers the complete parent-side user management foundation required for all subsequent parental control features.

### Story 2.1: Build Parent Registration Screen

As a **parent**,
I want to register for a KidGuard account with my email and password,
so that I can start managing my children's screen time.

**Acceptance Criteria:**
1. Registration screen created at `/app/(auth)/register.tsx` with French UI
2. Form fields: email, password, confirm password
3. Client-side validation: valid email format, password minimum 8 characters, passwords match
4. Form submission uses Better Auth client's `signUp` method
5. Email verification sent upon successful registration (handled by Better Auth)
6. User redirected to email verification pending screen
7. Error messages displayed in French for validation failures or registration errors
8. Loading state displayed during authentication

### Story 2.2: Build Parent Login Screen

As a **parent**,
I want to log into my KidGuard account,
so that I can access my dashboard and manage settings.

**Acceptance Criteria:**
1. Login screen created at `/app/(auth)/login.tsx` with French UI
2. Form fields: email, password
3. "Forgot password" link displayed (handled by Better Auth, functionality deferred to Phase 2)
4. Form submission uses Better Auth client's `signIn` method
5. Successful login redirects to parent dashboard
6. Failed login displays French error message
7. Session managed automatically by Better Auth
8. Loading state displayed during authentication

### Story 2.3: Create Child Profile Management Screen

As a **parent**,
I want to create and view child profiles,
so that I can configure individual settings for each child.

**Acceptance Criteria:**
1. Child profile list screen created at `/app/(parent)/children/index.tsx`
2. "Add Child" button prominently displayed
3. List displays all child profiles with name, age, and avatar placeholder
4. Tap on child profile navigates to child detail/edit screen
5. Empty state message displayed when no children exist: "Ajoutez votre premier enfant"
6. Screen only accessible to authenticated parents
7. French language throughout

### Story 2.4: Build Add/Edit Child Profile Form

As a **parent**,
I want to add a new child or edit an existing child's basic information,
so that I can personalize settings for each child.

**Acceptance Criteria:**
1. Add/Edit child form screen created at `/app/(parent)/children/[id].tsx`
2. Form fields: child name (required), age (required, dropdown 6-14), avatar selection (optional)
3. API route created: `/app/api/child/profile+api.ts` (POST for create, PUT for update)
4. Prisma schema includes ChildProfile model with fields: id, parentId, name, age, avatar, createdAt, updatedAt
5. Form submission saves to database via API route
6. Success redirects back to child list screen
7. Delete button displayed on edit screen (with confirmation dialog)
8. French validation messages and labels

### Story 2.5: Configure Child Exercise Preferences

As a **parent**,
I want to select which exercise types my child will receive,
so that I can align challenges with their learning needs.

**Acceptance Criteria:**
1. Exercise preferences section added to child profile screen
2. Checkboxes for exercise types: Math (Mathématiques), Reading (Lecture), Logic (Logique), Vocabulary (Vocabulaire)
3. At least one exercise type must be selected (validation)
4. Preferences saved to ChildProfile model in database (JSON field or separate table)
5. Default: all exercise types enabled for new child profiles
6. Changes saved immediately with visual confirmation
7. French labels and descriptions

### Story 2.6: Configure Difficulty Level and Time Rewards

As a **parent**,
I want to set difficulty level and screen time rewards per exercise,
so that challenges are appropriate for my child's age and I control reward amounts.

**Acceptance Criteria:**
1. Difficulty level dropdown added to child profile: Easy (Facile), Medium (Moyen), Hard (Difficile)
2. Default difficulty auto-selected based on child's age (6-8: Easy, 9-11: Medium, 12-14: Hard)
3. Time reward input field: minutes of screen time earned per completed exercise (default: 15 minutes)
4. Validation: time reward must be between 5-60 minutes
5. Settings saved to ChildProfile model in database
6. Changes persist and are reflected when child completes exercises
7. French labels and help text explaining each difficulty level

### Story 2.7: Configure App Blocking List

As a **parent**,
I want to select which apps will be blocked during child mode,
so that I control what requires earning through exercises.

**Acceptance Criteria:**
1. App blocking section added to child profile screen
2. Common app categories displayed with checkboxes: Social Media, Games, Videos, All Apps
3. "All Apps" option blocks everything except KidGuard itself
4. Default: "All Apps" selected for new child profiles
5. App blocking preferences saved to ChildProfile model
6. Note displayed: "App blocking requires iOS permissions configured in Epic 5"
7. French labels and category names

---

## Epic 3: DeepSeek AI Exercise Generation & Validation

**Epic Goal:** Integrate DeepSeek API to generate varied, age-appropriate French exercises across multiple subjects (math, reading, logic, vocabulary) and validate child answers in real-time with age-appropriate leniency. Implement exercise caching, fallback mechanisms, and prompt engineering to ensure consistent quality, minimal API costs, and reliable operation even during service disruptions.

### Story 3.1: Set Up DeepSeek API Integration

As a **developer**,
I want to integrate the DeepSeek API client,
so that I can call AI services for exercise generation and validation.

**Acceptance Criteria:**
1. DeepSeek API credentials obtained and stored securely in `.env`
2. DeepSeek SDK or HTTP client library installed
3. Service module created: `/lib/services/deepseek.ts` with reusable API call functions
4. API connection tested with simple prompt/response
5. Error handling implemented for network failures, rate limits, timeouts
6. Retry logic implemented (max 3 retries with exponential backoff)
7. API response time logging for monitoring
8. Cost tracking utility function created to monitor API usage

### Story 3.2: Design Exercise Generation Prompts

As a **developer**,
I want to create prompt templates for generating French exercises,
so that DeepSeek produces consistent, high-quality educational content.

**Acceptance Criteria:**
1. Prompt templates created for each subject type: Math, Reading, Logic, Vocabulary
2. Prompts include parameters: age range, difficulty level, subject
3. Prompts specify output format: JSON with question, answer, hints, exercise type
4. French language instruction embedded in prompts
5. Age-appropriate complexity guidelines included (6-8, 9-11, 12-14)
6. Prompt templates stored in `/lib/prompts/` directory
7. Example responses documented for each prompt template
8. Prompts tested manually with DeepSeek API to verify quality

### Story 3.3: Build Exercise Generation API Route

As a **developer**,
I want an API endpoint that generates exercises based on child profile,
so that the app can request new exercises on demand.

**Acceptance Criteria:**
1. API route created: `/app/api/exercise/generate+api.ts`
2. Endpoint accepts parameters: childId, subjectType, count (default 1)
3. Child profile fetched from database to determine age, difficulty, preferences
4. DeepSeek API called with appropriate prompt template
5. Response parsed and validated (ensures JSON structure is correct)
6. Generated exercise saved to Exercise table in database with metadata
7. Exercise returned in JSON response to client
8. Error handling for invalid requests, API failures
9. Response time target: <2 seconds

### Story 3.4: Implement Exercise Caching with Redis

As a **developer**,
I want to cache generated exercises in Redis,
so that I reduce API costs and improve response times.

**Acceptance Criteria:**
1. Redis client configured and connected
2. Cache key strategy: `exercise:${childId}:${subjectType}`
3. When exercise requested, check cache first before calling DeepSeek
4. Cache stores up to 10 exercises per child per subject type
5. Cache TTL set to 7 days
6. Cache miss triggers DeepSeek API call and cache population
7. Cache hit returns exercise immediately without API call
8. Cache invalidation logic when child settings change
9. Logging to track cache hit/miss rates

### Story 3.5: Create Pre-Generated Exercise Fallback Bank

As a **developer**,
I want a fallback bank of pre-generated exercises,
so that the app works even when DeepSeek API is unavailable.

**Acceptance Criteria:**
1. Script created to pre-generate 100 exercises across all subjects/age groups
2. Exercises stored in database table: FallbackExercise
3. Fallback exercises cover all combinations: 4 subjects × 3 difficulty levels × ~8 exercises each
4. When DeepSeek API fails after retries, fallback exercises retrieved from database
5. Fallback exercises marked in response so they can be tracked separately
6. Logging/alert when fallback is used (indicates API issue)
7. Fallback exercises manually reviewed for quality before deployment

### Story 3.6: Build Answer Validation API Route

As a **developer**,
I want an API endpoint that validates child answers using DeepSeek,
so that the app can determine if screen time should be unlocked.

**Acceptance Criteria:**
1. API route created: `/app/api/exercise/validate+api.ts`
2. Endpoint accepts parameters: exerciseId, childAnswer
3. Exercise fetched from database to retrieve correct answer and context
4. DeepSeek API called with validation prompt including: question, expected answer, child's answer, age
5. Validation prompt instructs AI to be lenient for spelling, synonyms, partial correctness based on age
6. AI response parsed: { isCorrect: boolean, feedback: string, leniencyApplied: boolean }
7. Validation result saved to ExerciseHistory table
8. Response returned to client with validation result
9. Response time target: <3 seconds
10. Fallback validation logic for API failures (exact string match as last resort)

### Story 3.7: Design Answer Validation Prompts with Age-Appropriate Leniency

As a **developer**,
I want validation prompts that apply age-appropriate leniency,
so that younger children aren't penalized for minor spelling errors.

**Acceptance Criteria:**
1. Validation prompt templates created for each age group: 6-8, 9-11, 12-14
2. Age 6-8: Very lenient (accept phonetic spelling, synonyms, partial answers)
3. Age 9-11: Moderate leniency (accept synonyms, minor spelling errors)
4. Age 12-14: Standard leniency (accept synonyms, exact spelling preferred)
5. Math validation: Accept different valid formats (e.g., "10", "dix", "10.0")
6. Prompts specify response format: JSON with validation decision and reasoning
7. Prompts tested with sample answers to verify leniency levels
8. French language considerations included (accents, special characters)

### Story 3.8: Track Exercise History and Performance

As a **developer**,
I want to track all exercise attempts and results,
so that parents can see progress and we can analyze AI quality.

**Acceptance Criteria:**
1. Prisma schema includes ExerciseHistory model: id, childId, exerciseId, answer, isCorrect, attemptedAt, validationTime
2. Every validation saves a record to ExerciseHistory table
3. Child's accuracy rate calculated: correct exercises / total exercises
4. API route created: `/app/api/child/activity+api.ts` to retrieve exercise history
5. History includes timestamps, subject types, success/failure
6. Data retention: 90 days per privacy policy, then aggregated
7. Analytics query to identify low-quality exercises (high failure rate)

---

## Epic 4: Child Exercise Interface & Gamification

**Epic Goal:** Build the playful, kid-friendly exercise challenge screen with colorful visuals, smooth animations, immediate feedback, and basic gamification elements (points, stars, time bank visualization). Create an engaging experience that makes learning feel like a game, encouraging children to complete exercises willingly without frustration, while maintaining 60fps performance and <2 second loading times.

### Story 4.1: Create Exercise Challenge Screen Layout

As a **child user**,
I want to see a fun, colorful screen when I need to complete an exercise,
so that I feel motivated to solve the challenge.

**Acceptance Criteria:**
1. Screen created at `/app/(child)/exercise.tsx` with vibrant, playful design
2. Header displays child's name and welcoming message in French: "Bonjour [Name]! Gagne du temps d'écran!"
3. Exercise question displayed in large, readable font (minimum 18pt)
4. Answer input area provided (text input, multiple choice buttons, or appropriate format)
5. Submit button styled as colorful, prominent CTA: "Valider"
6. Time bank indicator visible showing current earned screen time
7. Exit/back button hidden to prevent bypassing exercise
8. Background colors match child mode branding (bright, energetic)
9. Layout responsive for iPhone and iPad screen sizes

### Story 4.2: Implement Exercise Loading and Display

As a **child user**,
I want exercises to load quickly without waiting,
so that I don't get frustrated before starting.

**Acceptance Criteria:**
1. When child mode activated, exercise pre-fetched from cache or API
2. Loading state displays animated spinner with encouraging French text: "Préparation de ton défi..."
3. Exercise data fetched from `/app/api/exercise/generate+api.ts`
4. Exercise question and format rendered based on type (text, multiple choice, number input)
5. Math exercises display with proper formatting (equations, symbols)
6. Reading exercises display passage and question clearly
7. Logic/vocabulary exercises display appropriate UI elements
8. Loading time monitored: target <2 seconds from trigger to display
9. Error state if exercise fails to load: "Oups! Essaye à nouveau" with retry button

### Story 4.3: Build Answer Input Components

As a **child user**,
I want to easily input my answer using age-appropriate controls,
so that I can respond to the exercise without technical difficulty.

**Acceptance Criteria:**
1. Text input component for open-ended answers (auto-focus, large font)
2. Multiple choice buttons for selection-based exercises (min 44x44pt touch targets)
3. Number keypad for math exercises (numeric keyboard on mobile)
4. Voice input button for younger children (optional, uses device speech recognition)
5. Input validation prevents empty submissions
6. Clear/reset button available to change answer before submitting
7. Input components styled with child-friendly colors and rounded corners
8. Accessibility: inputs work with iOS VoiceOver (basic support)

### Story 4.4: Integrate Answer Validation with Feedback

As a **child user**,
I want to know immediately if my answer is correct,
so that I can learn and earn screen time or try again.

**Acceptance Criteria:**
1. Submit button triggers API call to `/app/api/exercise/validate+api.ts`
2. Loading state displayed during validation (animated spinner, 3 second max wait)
3. Correct answer triggers success animation and celebration screen
4. Incorrect answer displays encouraging feedback: "Presque! Essaye encore!" with hint
5. Validation response includes AI-generated feedback message in French
6. After incorrect answer, child can retry same exercise (max 2 attempts)
7. After 2 failed attempts, easier fallback exercise offered or screen time not awarded
8. Validation result logged to ExerciseHistory table
9. Error handling if validation API fails (retry or fallback to exact match)

### Story 4.5: Create Success Celebration Animation

As a **child user**,
I want to see a fun celebration when I answer correctly,
so that I feel accomplished and motivated to continue.

**Acceptance Criteria:**
1. Success screen displays with confetti animation (Lottie animation)
2. Celebratory message in French: "Bravo [Name]! Bonne réponse!" with emoji 🎉
3. Points/stars awarded displayed: "+10 étoiles"
4. Screen time earned displayed: "+15 minutes de temps d'écran"
5. Animation plays for 2-3 seconds before transitioning to unlocked state
6. Success sound effect plays (short, pleasant chime)
7. Haptic feedback on iOS devices (success vibration pattern)
8. Animation maintains 60fps performance

### Story 4.6: Build Time Bank Visualization

As a **child user**,
I want to see how much screen time I've earned,
so that I understand my progress and feel motivated.

**Acceptance Criteria:**
1. Time bank component displays current earned time (e.g., "45 minutes")
2. Visual representation: progress bar, filling hourglass, or growing tree graphic
3. Component visible on exercise screen header
4. Updates in real-time after successful exercise completion
5. Animation when time is added (smooth fill/growth effect)
6. Color-coded: green when time available, amber when low (<10 min), red when empty
7. French label: "Temps gagné" or "Banque de temps"
8. Component accessible from child mode home screen (if created in later story)

### Story 4.7: Implement Basic Points and Stars System

As a **child user**,
I want to earn points and stars for completing exercises,
so that I feel rewarded beyond just screen time.

**Acceptance Criteria:**
1. Points awarded per completed exercise: 10 points per correct answer
2. Stars awarded: 1 star per exercise, 5-star bonus for 10 exercises in a row
3. Points and stars stored in ChildProfile or separate gamification table
4. Points/stars total displayed on exercise screen
5. Visual star icons displayed (filled vs. outlined)
6. Small animation when earning points/stars
7. Leaderboard or achievements deferred to Phase 2 (just tracking for now)
8. French labels: "Étoiles" and "Points"

### Story 4.8: Add Encouraging Feedback for Mistakes

As a **child user**,
I want to receive kind, helpful feedback when I make mistakes,
so that I don't feel discouraged and want to try again.

**Acceptance Criteria:**
1. Incorrect answer displays gentle message: "Pas tout à fait! Voici un indice..."
2. AI-generated hint provided based on exercise type and child's answer
3. No negative language or harsh feedback
4. Message emphasizes effort: "Continue, tu peux le faire!"
5. Retry button clearly visible: "Réessayer"
6. Different encouraging messages rotated for variety
7. Mistakes not counted as failures in UI (only internally for analytics)
8. Age-appropriate tone (not patronizing for older children)

---

## Epic 5: Phone Sharing Mode & Device Lock Integration

**Epic Goal:** Implement the one-tap parent phone sharing mode that transitions the parent's device into child-locked mode with PIN-protected exit. Integrate react-native-device-activity to reliably block configured apps until exercises are completed. Deliver the core value proposition: automatic enforcement of screen time limits tied to exercise completion, with seamless mode switching for safe parent phone sharing.

### Story 5.1: Design Parent Dashboard with Phone Sharing Button

As a **parent**,
I want a prominent button to activate phone sharing mode,
so that I can quickly hand my phone to my child with confidence.

**Acceptance Criteria:**
1. Parent dashboard screen created at `/app/(parent)/dashboard.tsx`
2. Large, prominent button for each child: "[Child Name] va utiliser ce téléphone"
3. Button styled distinctly (different color, large touch target min 60x60pt)
4. Button displays child's avatar/icon if configured
5. Multiple child buttons displayed if parent has multiple children
6. Tapping button triggers confirmation dialog: "Activer le mode [Child Name]?"
7. Confirm action initiates child mode activation
8. Dashboard shows at-a-glance stats: children count, total exercises today
9. French language throughout

### Story 5.2: Implement Child Mode Activation and UI Transition

As a **parent**,
I want the app to visually transform when entering child mode,
so that it's obvious the phone is now in child mode.

**Acceptance Criteria:**
1. Tapping phone sharing button triggers mode transition
2. Full-screen modal or navigation to child mode interface
3. Visual transition animation (color shift from parent blue/green to child orange/yellow)
4. Child's name displayed prominently: "Mode [Child Name]"
5. App state persists: current child ID, mode status stored in app state/context
6. Child mode flag set in database: ChildSession table with startTime, deviceId
7. Parent UI routes become inaccessible (navigation blocked)
8. Child exercise screen becomes the main active screen
9. Transition completes in <1 second

### Story 5.3: Build PIN-Protected Exit from Child Mode

As a **parent**,
I want to exit child mode using my secure PIN,
so that my child cannot return to parent mode without permission.

**Acceptance Criteria:**
1. Small "Exit" button visible in child mode (top corner, minimal prominence)
2. Tapping "Exit" button displays PIN entry modal
3. PIN entry screen shows numeric keypad (0-9) with French label: "Code Parent"
4. Parent's PIN retrieved from ParentUser table in database
5. Correct PIN entry exits child mode and returns to parent dashboard
6. Incorrect PIN displays error: "Code incorrect" and allows retry
7. After 3 failed attempts, PIN entry locked for 30 seconds
8. Successful exit clears child session and resets app state
9. Visual transition back to parent mode (color shift back to parent branding)

### Story 5.4: Create PIN Setup Flow for Parents

As a **parent**,
I want to set up a secure PIN during onboarding,
so that I can control access to parent settings and exit child mode.

**Acceptance Criteria:**
1. PIN setup screen added to initial parent onboarding flow (after registration)
2. Parent prompted to create 4-digit PIN with French instruction: "Créez un code à 4 chiffres"
3. PIN confirmation required: "Confirmez votre code"
4. Validation: PINs must match, must be 4 digits
5. PIN stored hashed in database (never plain text)
6. PIN editable from parent settings screen
7. "Forgot PIN" recovery flow deferred to Phase 2 (requires email reset)
8. Default: if no PIN set, parent cannot activate child mode (forces setup)

### Story 5.5: Research and Set Up react-native-device-activity

As a **developer**,
I want to integrate react-native-device-activity and obtain Apple's Family Controls entitlement,
so that I can implement app blocking functionality.

**Acceptance Criteria:**
1. Library installed: `npm install react-native-device-activity`
2. **CRITICAL:** Request "Family Controls (Distribution)" entitlement from Apple - this requires approval for multiple bundle identifiers
3. Expo config plugin configured in app.json
4. Run `npx expo prebuild --platform ios` to generate native configuration
5. iOS deployment target set to 15.1+ (higher than our initial 15.0)
6. Test on physical iOS device (Device Activity APIs unavailable in simulator)
7. Document Apple approval process timeline and requirements
8. Identify provisioning complexity and potential blockers
9. **Risk assessment:** SwiftUI app selection view noted as crash-prone - document workarounds

### Story 5.6: Implement App Blocking with Device Activity Monitoring

As a **parent**,
I want configured apps to be blocked based on screen time limits,
so that my child must complete exercises to access them.

**Acceptance Criteria:**
1. Use `ReactNativeDeviceActivity.startMonitoring()` to create activity monitor for child
2. Monitor name follows pattern: `child_${childId}_session_${sessionId}`
3. Configure time interval based on earned screen time (e.g., 15 minutes after exercise completion)
4. Use `familyActivitySelection` to specify blocked apps from child profile settings
5. Set threshold event when time expires to re-lock apps
6. Maximum 20 simultaneous monitors respected (limit monitoring to active child sessions)
7. Shield Configuration API used to customize blocking screen with French message: "Complète un exercice pour débloquer!"
8. Shield Action API configured for "Complete Exercise" button that opens KidGuard exercise screen
9. Event naming strategy documented for tracking (max limits apply)
10. Monitoring stopped when parent exits child mode via PIN

### Story 5.7: Build Custom Shield UI for Blocked Apps

As a **child user**,
I want to see a friendly blocking screen when apps are locked,
so that I understand I need to complete an exercise.

**Acceptance Criteria:**
1. ShieldConfiguration API used to create custom blocking UI
2. Blocking screen displays in French: "Temps d'écran épuisé!"
3. Message explains: "Complète un exercice pour gagner plus de temps"
4. Button displayed: "Faire un exercice" using ShieldAction API
5. Button action redirects to KidGuard app exercise screen
6. Shield UI matches child mode branding (colorful, playful)
7. Shield persists until exercise completed and new time granted
8. No bypass options available on shield screen

### Story 5.8: Implement Exercise-to-Unlock Flow

As a **child user**,
I want to unlock screen time by completing exercises,
so that I can access my apps and games.

**Acceptance Criteria:**
1. When child mode activated with zero earned screen time, exercise screen displayed immediately
2. Child cannot dismiss or bypass exercise screen
3. Successful exercise completion awards configured time amount (e.g., 15 minutes)
4. Screen time countdown timer starts immediately after unlock
5. Timer displayed prominently in child mode interface: "Temps restant: 14:32"
6. When timer expires (screen time reaches zero), apps re-locked
7. New exercise presented automatically when time expires
8. Child can proactively complete exercises to earn more time before current time expires
9. Time bank persists across app restarts (stored in database)

### Story 5.9: Handle Device Lock State Persistence

As a **developer**,
I want child mode state to persist across app restarts,
so that children cannot bypass locks by force-quitting the app.

**Acceptance Criteria:**
1. Child mode state saved to database: active child ID, remaining screen time, lock status
2. On app launch, check if child mode was active before closing
3. If child mode was active, immediately restore child mode interface
4. Remaining screen time calculated from last known state and elapsed time
5. If screen time expired while app was closed, present exercise screen
6. Parent can only override by entering PIN to exit child mode
7. App restart or device restart does not reset child mode state
8. Edge case: If device was off for >24 hours, child mode auto-expires (safety mechanism)

---

## Epic 6: Parent Monitoring Dashboard & Analytics

**Epic Goal:** Create a comprehensive parent monitoring dashboard that displays child activity, exercise completion statistics, screen time usage patterns, and basic performance trends. Provide parents with visibility into what their children are learning, how much time they're earning, and whether the system is working effectively. Complete French localization across all parent-facing interfaces to deliver a fully MVP-ready product for the French market.

### Story 6.1: Build Parent Dashboard Overview

As a **parent**,
I want to see an overview of all my children's activity,
so that I can quickly assess how they're doing.

**Acceptance Criteria:**
1. Dashboard displays summary cards for each child
2. Each card shows: child name, avatar, total exercises completed today, screen time earned today, current streak
3. Quick stats section: total children, total exercises this week, average completion rate
4. Phone sharing mode buttons integrated (from Epic 5, Story 5.1)
5. Navigation to detailed child view on card tap
6. Empty state when no children exist: "Ajoutez votre premier enfant pour commencer"
7. Pull-to-refresh to update stats
8. French labels and formatting throughout

### Story 6.2: Create Child Activity Detail Screen

As a **parent**,
I want to view detailed activity for a specific child,
so that I can understand their progress and learning patterns.

**Acceptance Criteria:**
1. Detail screen created at `/app/(parent)/children/[id]/activity.tsx`
2. Header displays child name, age, current settings
3. Today's stats: exercises completed, screen time earned/used, accuracy rate
4. Weekly view: Chart or list showing daily exercise counts for past 7 days
5. Subject breakdown: Percentage of exercises by type (Math, Reading, Logic, Vocabulary)
6. Recent exercises list: Last 10 exercises with timestamp, subject, result (correct/incorrect)
7. Tap on individual exercise to see question, child's answer, validation feedback
8. French date/time formatting (e.g., "Aujourd'hui, 14h30")

### Story 6.3: Display Exercise Completion Stats and Trends

As a **parent**,
I want to see how consistently my child completes exercises,
so that I can gauge engagement and effectiveness.

**Acceptance Criteria:**
1. Exercise completion rate displayed: "Taux de réussite: 85%" (correct / total attempts)
2. Daily streak indicator: "Série actuelle: 7 jours" (consecutive days with at least 1 exercise)
3. Average exercises per day: Calculated over past 7 days
4. Chart visualization: Bar chart or line graph showing exercises per day
5. Trend indicator: Arrow up/down showing if activity increasing or decreasing
6. Completion time analytics: Average time spent per exercise
7. Stats updated in real-time as child completes exercises
8. French number formatting (e.g., "85 %" with space before %)

### Story 6.4: Show Screen Time Usage Patterns

As a **parent**,
I want to see how my child is using their earned screen time,
so that I can understand their usage behavior.

**Acceptance Criteria:**
1. Total screen time earned vs. used displayed: "Gagné: 90 min | Utilisé: 75 min | Restant: 15 min"
2. Daily screen time usage chart: Shows earned and used time per day over past 7 days
3. Average earn-to-use ratio: Percentage of earned time actually consumed
4. Peak usage times: Time of day when child most frequently earns/uses time (optional, Phase 2)
5. Time bank status: Current balance displayed prominently
6. Visual indicators: Green (healthy balance), Amber (low), Red (depleted)
7. French time formatting: "90 minutes" or "1h30"

### Story 6.5: Implement Subject Performance Breakdown

As a **parent**,
I want to see which subjects my child excels in or struggles with,
so that I can adjust settings or provide additional support.

**Acceptance Criteria:**
1. Subject performance section displays accuracy rate per subject type
2. Math, Reading, Logic, Vocabulary each shown with: exercises attempted, success rate, average difficulty
3. Visual representation: Progress bars or pie chart showing distribution
4. Sorting: Ability to view by most/least practiced or highest/lowest success rate
5. Recommendation displayed if success rate <60% in a subject: "Envisagez de réduire la difficulté pour [Subject]"
6. Tap on subject to see all exercises from that category
7. French subject names: Mathématiques, Lecture, Logique, Vocabulaire

### Story 6.6: Add Exercise Quality Feedback Mechanism

As a **parent**,
I want to report low-quality or inappropriate exercises,
so that AI-generated content can be improved.

**Acceptance Criteria:**
1. Each exercise in activity detail view has "Signaler un problème" button
2. Tapping opens feedback modal with options: Trop difficile, Trop facile, Inapproprié, Erreur dans la réponse, Autre
3. Optional text field for additional context
4. Feedback saved to ExerciseFeedback table with exerciseId, childId, parentId, issueType, comment
5. Feedback acknowledged: "Merci! Votre retour nous aide à améliorer."
6. Flagged exercises tracked in analytics for quality monitoring
7. Critical issues (Inapproprié) automatically disable exercise from rotation
8. French labels for all issue types

### Story 6.7: Create Parent Settings Screen

As a **parent**,
I want to manage my account settings and preferences,
so that I can update my information and app configuration.

**Acceptance Criteria:**
1. Settings screen created at `/app/(parent)/settings.tsx`
2. Account section: Email (read-only), change PIN button, logout button
3. Change PIN flow: Enter current PIN, enter new PIN, confirm new PIN
4. Notification preferences: Enable/disable push notifications for child milestones (optional)
5. Language preference: French selected (multiple languages in Phase 2)
6. Privacy policy and terms of service links
7. App version displayed at bottom
8. Delete account button (with strong confirmation dialog)
9. French labels throughout: "Paramètres", "Compte", "Confidentialité"

### Story 6.8: Finalize French Localization Across All Screens

As a **parent and child user**,
I want the entire app to be in French,
so that it feels natural and accessible for French-speaking families.

**Acceptance Criteria:**
1. All UI strings extracted to i18n translation files using react-i18next
2. Translation file `/locales/fr.json` contains all French strings
3. Every screen reviewed for complete French translation: labels, buttons, messages, errors
4. Date/time formatting uses French locale: `toLocaleDateString('fr-FR')`
5. Number formatting uses French conventions: space before %, comma for decimals
6. Currency formatting (if applicable in Phase 2): € symbol placement
7. Pluralization handled correctly: "1 exercice" vs "2 exercices"
8. Error messages, validation messages, API responses all in French
9. Manual QA by native French speaker to verify natural language usage
10. No English fallbacks visible in production build

---

## Checklist Results Report

### Executive Summary

- **Overall PRD Completeness:** 92%
- **MVP Scope Appropriateness:** Just Right
- **Readiness for Architecture Phase:** Ready
- **Most Critical Concern:** Apple Family Controls entitlement approval required before full Epic 5 implementation

**Assessment:** The PRD is comprehensive, well-structured, and ready for architectural design. All core sections are complete with clear user stories, acceptance criteria, and technical guidance. The MVP scope is appropriately minimal while delivering the core value proposition. The primary technical dependency (Apple entitlement) is identified and requires early action.

### Category Analysis Table

| Category                         | Status  | Critical Issues |
| -------------------------------- | ------- | --------------- |
| 1. Problem Definition & Context  | PASS    | None |
| 2. MVP Scope Definition          | PASS    | None |
| 3. User Experience Requirements  | PASS    | None |
| 4. Functional Requirements       | PASS    | None |
| 5. Non-Functional Requirements   | PASS    | None |
| 6. Epic & Story Structure        | PASS    | None |
| 7. Technical Guidance            | PASS    | Apple entitlement dependency flagged |
| 8. Cross-Functional Requirements | PASS    | None |
| 9. Clarity & Communication       | PASS    | French validation by native speaker required |

### Top Issues by Priority

**BLOCKERS:**
- Apple "Family Controls (Distribution)" entitlement must be requested immediately in Epic 1 - approval can take 1-2 weeks

**HIGH:**
- French language content quality validation: All French strings and exercise content should be reviewed by native French speaker before launch (Epic 6, Story 6.8)
- react-native-device-activity integration testing on physical device required early (Story 5.5)

**MEDIUM:**
- DeepSeek prompt engineering testing: Allocate time for extensive prompt testing to achieve 95%+ validation accuracy (Epic 3)
- Exercise fallback bank creation: Pre-generate 100 exercises for offline reliability (Epic 3, Story 3.5)
- SwiftUI app selection crashes: Implement error handling for known library issue

**LOW:**
- Voice input for younger children (Story 4.3) - marked as optional, can be deferred
- Exercise quality feedback mechanism could be simplified for MVP

### Critical Technical Risks

1. **CRITICAL:** Apple Family Controls entitlement approval - may take 1-2 weeks, could delay launch if rejected
2. **HIGH:** react-native-device-activity constraints (20 monitor limit, SwiftUI crashes) - requires careful architecture
3. **MEDIUM:** DeepSeek French content quality and 95% validation accuracy - requires extensive prompt engineering
4. **MEDIUM:** DeepSeek API costs at scale - mitigated with caching and fallback strategies

### Recommendations

**Immediate Actions (Week 1):**
1. Apply for Apple Family Controls entitlement immediately
2. Set up Expo project and request physical iOS test device
3. Engage native French speaker for ongoing content validation

**During Development:**
1. Complete Story 5.5 (react-native-device-activity setup) early to validate technical feasibility
2. Implement Sentry and analytics from Epic 1 for continuous monitoring
3. Allocate dedicated time for DeepSeek prompt engineering and testing

**Architectural Focus:**
1. Design modular approach for Device Activity integration with clear fallback if API proves limiting
2. Redis caching architecture for cost optimization
3. Database schema optimization for child activity queries
4. Real-time exercise pre-fetching strategy

### Final Decision

✅ **READY FOR ARCHITECT**

The PRD is comprehensive and ready for architectural design. The product vision is clear, requirements are well-defined, and MVP scope is appropriate. Critical dependencies (Apple entitlement, react-native-device-activity) are identified with mitigation strategies.

---

## Next Steps

### UX Expert Prompt

You are the UX Expert for KidGuard, a mobile app that helps French parents manage children's screen time through playful AI-generated exercises.

**Your Task:** Review this PRD and the User Interface Design Goals section. Create detailed UX/UI specifications including:

1. **User Flow Diagrams** - Map out complete parent and child journeys
2. **Wireframes** - Design the 11 core screens identified in the PRD
3. **Visual Design System** - Define color palettes, typography, iconography, and components for both parent mode (calming blues/greens) and child mode (vibrant oranges/yellows/purples)
4. **Animation Specifications** - Detail the celebration animations, mode transitions, and micro-interactions
5. **French Localization Guidelines** - Ensure all UI text is natural, age-appropriate French

**Key Priorities:**
- Dual UX: Professional/reassuring for parents vs. playful/engaging for children
- One-tap phone sharing mode with clear visual state transitions
- Exercise challenges that feel like mini-games, not homework
- Accessibility: WCAG AA compliance for parent interfaces
- French-first design (all text, date/time formats, cultural appropriateness)

**Deliverable:** UX specification document ready for handoff to the Architect and developers.

### Architect Prompt

You are the Technical Architect for KidGuard. Review this PRD and design the complete technical architecture.

**Project Context:**
- **Tech Stack:** Expo (React Native), Expo API Routes (`app/api/*+api.ts`), Prisma + Supabase Accelerate, Better Auth, DeepSeek AI, react-native-device-activity
- **Platform:** iOS 15.1+ (iPhone/iPad), French market MVP
- **Timeline:** 3-4 months, solo/small team
- **Critical Constraint:** Apple Family Controls entitlement required for app blocking

**Your Task:** Create comprehensive architecture documentation covering:

1. **System Architecture Diagram** - Show mobile app, API routes, database, external services (DeepSeek, Supabase, Device Activity)
2. **Database Schema** - Prisma schema with all models: ParentUser, ChildProfile, Exercise, ExerciseHistory, FallbackExercise, ChildSession, ExerciseFeedback
3. **API Route Design** - Define all endpoints in `/app/api/` with request/response schemas
4. **DeepSeek Integration Architecture** - Prompt management, caching strategy (Redis), fallback mechanisms, cost optimization
5. **Device Activity Integration** - react-native-device-activity implementation strategy, monitor lifecycle, shield configuration
6. **State Management** - App state architecture for parent/child mode, session persistence, time tracking
7. **Caching Strategy** - Redis usage for exercises, sessions, and rate limiting
8. **Security Architecture** - Better Auth integration, PIN storage, GDPR-K compliance, data encryption
9. **Performance Optimization** - Exercise pre-fetching, lazy loading, 60fps animations, <2s/<3s response times
10. **Error Handling & Resilience** - API failures, offline scenarios, retry logic
11. **Deployment Architecture** - EAS Build/Submit/Update, CI/CD pipeline, environment configuration
12. **Testing Strategy** - Unit/integration test structure, manual testing checklist

**Critical Technical Risks to Address:**
1. Apple Family Controls entitlement approval process - timeline and mitigation
2. react-native-device-activity constraints (20 monitor limit, SwiftUI crashes)
3. DeepSeek French content quality and validation accuracy (95% target)
4. iOS-only Device Activity APIs - ensure no simulator dependencies in dev workflow

**Deliverable:** Technical architecture document with diagrams, schemas, and implementation guidance for all 6 epics.
