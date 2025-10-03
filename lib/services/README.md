# Services

This directory contains business logic services for KidGuard.

## Planned Services

- **auth.ts** - Authentication service using Better Auth
- **deepseek.ts** - DeepSeek AI integration for exercise generation and validation
- **database.ts** - Database connection and query utilities
- **exercise-generator.ts** - Exercise generation logic
- **exercise-validator.ts** - Answer validation logic
- **lock-manager.ts** - Device lock/unlock management

## Architecture

Services should be platform-agnostic and contain pure business logic that can be used by both API routes and client-side code.
