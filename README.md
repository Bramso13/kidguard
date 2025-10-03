# 🎯 KidGuard

Transform screen time management into educational engagement. KidGuard is an iOS-first mobile application that requires children to complete playful AI-generated exercises before unlocking screen time.

## 📋 Project Overview

KidGuard helps French parents manage children's screen time through:
- 🎮 **Gamified Learning**: AI-generated exercises that feel like mini-games
- 🔒 **Automatic Enforcement**: System-level app blocking tied to exercise completion  
- 📱 **Phone Sharing Mode**: Parents can safely hand their phone to children
- 📊 **Parent Dashboard**: Monitor learning progress and screen time usage
- 🇫🇷 **French-First**: Fully localized for the French market

## 🏗️ Architecture

This is a **monorepo** built with:
- **Frontend**: Expo + React Native + TypeScript + Expo Router
- **Backend**: Expo API Routes (co-located with frontend)
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Caching**: Redis (Upstash)
- **AI**: DeepSeek for exercise generation and validation
- **Auth**: Better Auth
- **iOS Integration**: react-native-device-activity (Family Controls)

### Repository Structure

```
kidguard/
├── app/                    # Expo Router - UI routes and API routes
│   ├── (auth)/            # Auth screens
│   ├── (parent)/          # Parent mode screens
│   ├── (child)/           # Child mode screens
│   ├── api/               # Backend API routes (+api.ts files)
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry screen
├── lib/                   # Shared business logic
│   ├── services/          # DeepSeek, auth, database services
│   ├── types/             # TypeScript interfaces (shared FE/BE)
│   ├── utils/             # Common utilities
│   ├── prompts/           # DeepSeek prompt templates
│   └── context/           # React Context providers
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── assets/                # Images, animations, fonts
├── locales/               # i18n translations (French)
│   └── fr.json
├── prisma/                # Database schema and migrations
│   └── schema.prisma
├── tests/                 # Test files
│   ├── unit/
│   └── integration/
├── docs/                  # Documentation
│   ├── architecture.md
│   ├── prd.md
│   └── brief.md
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
└── .eslintrc.js          # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Expo CLI: `npm install -g expo-cli eas-cli`
- Xcode 14+ (macOS, for iOS development)
- Physical iOS device (Device Activity framework requires physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/kidguard.git
   cd kidguard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Generate Prisma Client** (when database is configured)
   ```bash
   npm run db:generate
   ```

5. **Run database migrations** (when database is configured)
   ```bash
   npm run db:migrate
   ```

### Development

Start the Expo development server:

```bash
npm start
```

This will open Expo DevTools in your browser. You can then:
- Press `i` to open in iOS Simulator
- Scan QR code with Expo Go app on physical device
- Press `w` to open in web browser (limited functionality)

### Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Start on iOS simulator
- `npm run android` - Start on Android emulator
- `npm test` - Run tests
- `npm run lint` - Lint code with ESLint
- `npm run type-check` - Check TypeScript types
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🔑 Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
REDIS_URL="redis://..."
DEEPSEEK_API_KEY="sk-..."
BETTER_AUTH_SECRET="..."
NODE_ENV="development"
```

See `.env.example` for a complete list of required variables.

## 🧪 Testing

Run tests with:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

## 📱 Building for Production

### iOS Build

1. **Configure EAS** (first time only)
   ```bash
   eas build:configure
   ```

2. **Create production build**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

### Over-the-Air Updates

Deploy updates without App Store review:

```bash
eas update --branch production
```

## 🏛️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Frontend Framework | Expo SDK | 51+ | React Native framework |
| Language | TypeScript | 5.3+ | Type-safe development |
| UI Components | React Native Paper | 5.12+ | Material Design components |
| Routing | Expo Router | Latest | File-based routing |
| Backend | Expo API Routes | Expo 51+ | RESTful endpoints |
| Database | PostgreSQL | 15+ | Primary database |
| ORM | Prisma | 5.9+ | Type-safe database client |
| Cache | Upstash Redis | Latest | Session & exercise caching |
| Auth | Better Auth | 1.0+ | Authentication |
| AI | DeepSeek | Latest | Exercise generation/validation |
| i18n | react-i18next | 14+ | French localization |
| Animations | Lottie | 6.5+ | Celebration animations |
| Monitoring | Sentry | Latest | Error tracking |

## 📚 Documentation

- [Architecture Document](./docs/architecture.md) - Complete technical architecture
- [Product Requirements](./docs/prd.md) - Detailed requirements and user stories
- [Project Brief](./docs/brief.md) - Project overview and vision

## 🤝 Contributing

This is a private project. For internal team members:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -m 'Add feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Create a Pull Request

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues or questions:
- Check the [Architecture Document](./docs/architecture.md)
- Review the [PRD](./docs/prd.md)
- Contact the development team

---

**Made with ❤️ for French families**
