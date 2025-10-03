# Components

This directory contains reusable React Native components for KidGuard.

## Structure

Components should be organized by feature or purpose:

```
components/
├── ui/                    # Reusable UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── parent/                # Parent-mode specific
│   ├── ChildCard.tsx
│   ├── PhoneSharingButton.tsx
│   └── PinEntry.tsx
├── child/                 # Child-mode specific
│   ├── ExerciseCard.tsx
│   ├── SuccessAnimation.tsx
│   └── TimeBank.tsx
└── shared/                # Used in both modes
    ├── Header.tsx
    └── ModeTransition.tsx
```

## Guidelines

- Use TypeScript for all components
- Follow React Native best practices
- Keep components focused and single-purpose
- Use shared types from `/lib/types`
- Style with StyleSheet or nativewind
- Export named components, not default exports
