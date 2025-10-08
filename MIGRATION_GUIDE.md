# 🔄 Instructions de Migration du Schema Prisma

## Objectif
Fusionner le fichier `prisma/schema-updates.prisma` avec `prisma/schema.prisma` et exécuter la migration.

## ⚠️ IMPORTANT
Le fichier `schema-updates.prisma` contient TOUS les modèles nécessaires pour KidGuard. Le `schema.prisma` actuel ne contient que les modèles Better Auth (User, Session, Account, Verification).

## 📋 Étapes

### 1. Backup du Schema Actuel
```bash
cp prisma/schema.prisma prisma/schema.prisma.backup
```

### 2. Option A: Remplacement Complet (RECOMMANDÉ)

Le `schema-updates.prisma` est complet. Il suffit de :

```bash
# Copier le nouveau schema
cp prisma/schema-updates.prisma prisma/schema.prisma

# Vérifier
cat prisma/schema.prisma
```

⚠️ **ATTENTION**: Le schema-updates.prisma inclut :
- ✅ Les modèles Better Auth (User, Session, Account, Verification)
- ✅ Tous les nouveaux modèles KidGuard
- ✅ Les relations complètes
- ✅ Les index optimisés

### 3. Option B: Fusion Manuelle (Si modifications custom)

Si vous avez fait des modifications au schema actuel, fusionnez manuellement :

1. Ouvrir `prisma/schema.prisma`
2. Ouvrir `prisma/schema-updates.prisma`
3. Copier UNIQUEMENT les nouveaux modèles :
   - ParentUser
   - ChildProfile
   - Exercise
   - ExerciseHistory
   - FallbackExercise
   - ChildSession
   - ExerciseFeedback
4. Copier les enums :
   - DifficultyLevel
   - ExerciseType
   - FeedbackIssueType
   - FeedbackStatus

### 4. Vérifier le Schema

```bash
# Formatter le schema
npx prisma format

# Valider le schema
npx prisma validate
```

### 5. Créer la Migration

```bash
# Créer et appliquer la migration
npx prisma migrate dev --name add_exercise_models

# Si demandé, confirmer que vous voulez reset la DB
# (Seulement en développement, sinon utiliser --create-only)
```

### 6. Générer le Client Prisma

```bash
# Générer le client TypeScript
npx prisma generate
```

### 7. Vérifier la Migration

```bash
# Ouvrir Prisma Studio pour voir les nouvelles tables
npx prisma studio
```

Vous devriez voir :
- ✅ parent_users
- ✅ child_profiles
- ✅ exercises
- ✅ exercise_history
- ✅ fallback_exercises
- ✅ child_sessions
- ✅ exercise_feedback

## 🧪 Créer des Données de Test

### Via Prisma Studio
1. `npm run db:studio`
2. Créer un ParentUser
3. Créer un ChildProfile lié

### Via SQL
```sql
-- 1. Créer un parent (ID fictif pour démo)
INSERT INTO parent_users (
  id, email, email_verified, pin_hash, locale
) VALUES (
  'parent-test-001',
  'parent@test.com',
  true,
  '$2a$10$abcdefghijklmnopqrstuvwxyz123456',  -- hash bcrypt de "1234"
  'fr'
);

-- 2. Créer un enfant
INSERT INTO child_profiles (
  id,
  parent_id,
  name,
  age,
  difficulty_level,
  exercise_types,
  time_reward_minutes,
  blocked_app_categories
) VALUES (
  'child-test-001',
  'parent-test-001',
  'Sophie',
  8,
  'MEDIUM',
  ARRAY['MATH', 'READING', 'LOGIC']::exercise_type[],
  15,
  ARRAY['games', 'videos']
);
```

### Via Prisma Client
Créer `scripts/seed-test-data.ts` :

```typescript
import { PrismaClient } from '@/prisma/generated/client';

const prisma = new PrismaClient();

async function main() {
  // Créer un parent
  const parent = await prisma.parentUser.create({
    data: {
      id: 'parent-test-001',
      email: 'parent@test.com',
      emailVerified: true,
      pinHash: '$2a$10$abcdefghijklmnopqrstuvwxyz123456', // "1234"
      locale: 'fr',
    },
  });

  console.log('✅ Parent créé:', parent.id);

  // Créer un enfant
  const child = await prisma.childProfile.create({
    data: {
      id: 'child-test-001',
      parentId: parent.id,
      name: 'Sophie',
      age: 8,
      difficultyLevel: 'MEDIUM',
      exerciseTypes: ['MATH', 'READING', 'LOGIC'],
      timeRewardMinutes: 15,
      blockedAppCategories: ['games', 'videos'],
    },
  });

  console.log('✅ Enfant créé:', child.id);
}

main()
  .then(() => {
    console.log('✅ Seed complet');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error('❌ Erreur:', e);
    prisma.$disconnect();
    process.exit(1);
  });
```

Puis exécuter :
```bash
npx tsx scripts/seed-test-data.ts
```

## ✅ Vérification

### 1. Vérifier les Tables
```bash
npx prisma studio
```

### 2. Tester l'API
```bash
# Démarrer le serveur
npm start

# Dans un autre terminal
curl -X POST http://localhost:8081/api/exercise/generate \
  -H "Content-Type: application/json" \
  -d '{
    "childId": "child-test-001",
    "subjectType": "math",
    "count": 1
  }'
```

### 3. Vérifier les Logs
```bash
# Vous devriez voir dans les logs du serveur:
[Exercise Generation] Fetching child profile: child-test-001
[Exercise Generation] Type: math, Difficulty: MEDIUM, Age: 8
[Exercise Generation] Calling DeepSeek API...
[Exercise Generation] DeepSeek returned 1 exercises
[Exercise Generation] Saved exercise: ex-uuid-xxx
[Exercise Generation] Success! Generated 1 exercises in 1456ms
```

## 🔧 Dépannage

### Erreur: "Migration failed"
```bash
# Reset la base (DÉVELOPPEMENT SEULEMENT!)
npx prisma migrate reset

# Puis re-migrer
npx prisma migrate dev --name add_exercise_models
```

### Erreur: "Type X is not valid"
```bash
# S'assurer que le schema contient bien les enums
# Vérifier que les enums sont AVANT les modèles qui les utilisent
```

### Erreur: "Client not found"
```bash
# Régénérer le client
npx prisma generate
```

### Erreur: "Cannot import PrismaClient"
```typescript
// Utiliser le bon import (path configuré dans schema.prisma)
import { PrismaClient } from '@/prisma/generated/client/edge';
```

## 📊 Résultat Attendu

Après migration réussie :
```
✅ 11 tables créées :
   - User (Better Auth)
   - Session (Better Auth)
   - Account (Better Auth)
   - Verification (Better Auth)
   - parent_users (KidGuard)
   - child_profiles (KidGuard)
   - exercises (KidGuard)
   - exercise_history (KidGuard)
   - fallback_exercises (KidGuard)
   - child_sessions (KidGuard)
   - exercise_feedback (KidGuard)

✅ 4 enums créés :
   - DifficultyLevel (EASY, MEDIUM, HARD)
   - ExerciseType (MATH, READING, LOGIC, VOCABULARY)
   - FeedbackIssueType
   - FeedbackStatus

✅ Relations configurées
✅ Index créés pour performance
```

## 🎉 Prochaines Étapes

Une fois la migration complétée :
1. ✅ Configurer `DEEPSEEK_API_KEY` dans `.env`
2. ✅ Tester l'API avec les données de test
3. ✅ Vérifier les performances (<2s)
4. ✅ Documenter les résultats
5. ➡️ Passer à Story 3.4 (Redis Caching)

---

**Créé le**: 2025-10-08
**Fichier**: MIGRATION_GUIDE.md
**Issue**: LES-84
