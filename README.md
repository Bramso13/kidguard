# KidGuard

> Transform screen time management into educational engagement

KidGuard is a mobile application that helps French parents manage children's screen time by requiring them to complete educational exercises before earning device access. Built with Expo and React Native, featuring AI-generated challenges and automatic enforcement.

## 🎯 Features

- **Parent Control Panel**: Manage multiple child profiles with individual settings
- **Parent Phone Sharing Mode**: One-tap switch to safely share your phone with children
- **AI-Generated Exercises**: Varied, age-appropriate challenges in French (math, reading, logic, vocabulary)
- **Smart Answer Validation**: AI-powered validation with age-appropriate leniency
- **Automatic Enforcement**: Device-level app blocking integrated with iOS Device Activity framework
- **Gamification**: Points, stars, and visual time bank to motivate children
- **French-First**: Complete French localization for the MVP market

## 🏗️ Architecture

This project uses a **monorepo structure** with Expo's integrated API routes pattern:

```
kidguard/
├── app/                          # Expo Router - UI routes and API routes
│   ├── (auth)/                   # Auth screens (login, register)
│   ├── (parent)/                 # Parent mode screens
│   ├── (child)/                  # Child mode screens
│   ├── api/                      # Backend API routes (+api.ts files)
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Home screen
├── lib/                          # Shared business logic
│   ├── services/                 # DeepSeek, auth, database services
│   ├── types/                    # TypeScript interfaces (shared FE/BE)
│   ├── utils/                    # Common utilities
│   └── prompts/                  # DeepSeek prompt templates
├── components/                   # Reusable UI components
├── hooks/                        # Custom React hooks
├── prisma/                       # Database schema and migrations
├── locales/                      # i18n translations (French)
├── assets/                       # Images, animations, fonts
└── docs/                         # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Expo CLI: `npm install -g expo-cli eas-cli`
- Xcode 14+ (for iOS development on macOS)
- Physical iOS device (required for Device Activity framework testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kidguard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on iOS**
   ```bash
   npm run ios
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kidguard
DIRECT_URL=postgresql://user:password@localhost:5432/kidguard

# Redis
REDIS_URL=redis://localhost:6379

# DeepSeek AI
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Better Auth
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:8081

# Environment
NODE_ENV=development
```

## 📦 Tech Stack

### Frontend
- **Framework**: Expo SDK 51+ with React Native
- **Language**: TypeScript 5.3+
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: React Native Paper
- **State Management**: React Context + useReducer
- **Animations**: Lottie (lottie-react-native)
- **Localization**: react-i18next

### Backend
- **Framework**: Expo API Routes (integrated with app)
- **Authentication**: Better Auth 1.0+
- **Database**: PostgreSQL 15+ (Supabase)
- **ORM**: Prisma 5.9+
- **Cache**: Upstash Redis
- **AI/ML**: DeepSeek API

### Infrastructure
- **Hosting**: Expo Application Services (EAS)
- **Build**: EAS Build
- **Deployment**: EAS Submit & Update
- **Monitoring**: Sentry
- **CI/CD**: GitHub Actions

## 🛠️ Development Scripts

```bash
# Start development server
npm start

# Run on specific platform
npm run ios          # iOS simulator (limited Device Activity support)
npm run android      # Android emulator
npm run web          # Web browser

# Code quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking

# Database (when Prisma is set up)
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio

# Testing
npm test            # Run tests

# Utilities
npm run clean       # Clean node_modules, .expo, dist
```

## 📚 Project Structure Details

### `/app` - Expo Router
File-based routing for both UI screens and API endpoints. Folders in parentheses like `(auth)` are route groups that don't affect the URL structure.

### `/app/api` - Backend API Routes
RESTful API endpoints using Expo's `+api.ts` pattern. Each file exports HTTP method handlers (GET, POST, PUT, DELETE).

### `/lib` - Shared Business Logic
Platform-agnostic code used by both frontend components and API routes:
- `services/` - Business logic services (auth, AI, database)
- `types/` - Shared TypeScript interfaces
- `utils/` - Helper functions
- `prompts/` - DeepSeek AI prompt templates

### `/components` - React Components
Reusable UI components organized by feature or purpose.

### `/hooks` - Custom React Hooks
Custom hooks for state management, API calls, and side effects.

## 🔧 Configuration Files

- `app.json` - Expo app configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.js` - ESLint rules
- `.prettierrc` - Prettier formatting rules
- `.gitignore` - Git ignore patterns
- `eas.json` - EAS Build configuration (to be created)

## 🎨 Code Standards

### Naming Conventions
- Components: PascalCase (`ExerciseCard.tsx`)
- Hooks: camelCase with 'use' prefix (`useChildMode.ts`)
- API Routes: kebab-case (`/api/child/profile+api.ts`)
- Functions: camelCase (`generateExercise()`)
- Types/Interfaces: PascalCase (`ChildProfile`)

### TypeScript
- Strict mode enabled
- No implicit any
- Explicit return types for public functions
- Shared types in `/lib/types`

### French Language
- All user-facing strings must be in French
- Use i18n keys from `/locales/fr.json`
- French date/time formatting
- French number formatting (space before %)

## 🚨 Important Notes

### iOS Device Activity Framework
- **Physical device required** - Device Activity APIs do not work in the iOS Simulator
- **Apple entitlement needed** - "Family Controls (Distribution)" entitlement approval takes 1-2 weeks
- **iOS 15.1+ minimum** - Required for Device Activity framework
- **Testing limitations** - Use physical iPhone/iPad for full feature testing

### Development Workflow
1. Make changes to code
2. Run `npm run type-check` to verify TypeScript
3. Run `npm run lint:fix` to fix code style
4. Test on device/simulator
5. Commit changes

## 📖 Documentation

- [Architecture Document](./docs/architecture.md) - Complete technical architecture
- [PRD](./docs/prd.md) - Product Requirements Document
- [Project Brief](./docs/brief.md) - Original project vision

## 🤝 Contributing

This is a greenfield MVP project. For development guidelines:

1. Follow the architecture defined in `docs/architecture.md`
2. Implement stories from `docs/prd.md` in order
3. Maintain code quality standards
4. Write tests for business logic
5. Keep French language quality high (native speaker review)

## 📝 License

Private project - All rights reserved

## 🆘 Troubleshooting

### Common Issues

**Metro bundler cache issues**
```bash
npm start -- --clear
```

**Node modules out of sync**
```bash
npm run clean
npm install
```

**TypeScript errors**
```bash
npm run type-check
```

**iOS build fails**
```bash
npx expo prebuild --clean
```

### Getting Help

- Check documentation in `/docs`
- Review architecture patterns
- Consult Expo documentation: https://docs.expo.dev
- React Native docs: https://reactnative.dev

## 🎯 Next Steps

1. ✅ Initialize Expo project with monorepo structure
2. Configure EAS Build and Deployment
3. Set up PostgreSQL database with Supabase and Prisma
4. Integrate Better Auth for parent authentication
5. Create health check API endpoint
6. Set up error tracking with Sentry

See `docs/prd.md` for complete development roadmap.

---

Built with ❤️ for French families
