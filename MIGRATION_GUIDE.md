# Guide de Migration - LES-80

## 🚀 Étapes de Déploiement

### 1. Préparation

Assurez-vous d'avoir configuré les variables d'environnement:

```bash
# .env ou .env.local
DATABASE_URL_PRISMA_MIGRATION="postgresql://..."
```

### 2. Installation des Dépendances

Si Prisma n'est pas encore installé:

```bash
npm install -D prisma@latest
npm install @prisma/client@latest
```

### 3. Génération du Client Prisma

```bash
npm run db:generate
# ou
npx prisma generate
```

Cette commande va:
- Générer le client Prisma dans `prisma/generated/client`
- Créer les types TypeScript pour les modèles

### 4. Création de la Migration

```bash
npm run db:migrate
# ou
npx prisma migrate dev --name add-child-profile
```

Cette commande va:
- Créer une nouvelle migration dans `prisma/migrations/`
- Appliquer la migration à la base de données
- Générer le client Prisma

### 5. Vérification

Vérifiez que la migration a été appliquée:

```bash
npx prisma studio
```

Vous devriez voir la nouvelle table `child_profiles` avec ses colonnes.

## 📝 Structure de la Migration

La migration créera:

### Table: `child_profiles`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique |
| `parentId` | String | Référence vers User |
| `name` | String | Nom de l'enfant |
| `age` | Integer | Âge (6-14) |
| `avatar` | String? | Avatar optionnel |
| `difficultyLevel` | Enum | EASY, MEDIUM, HARD |
| `exerciseTypes` | Array | Types d'exercices |
| `timeRewardMinutes` | Integer | Temps de récompense (défaut: 15) |
| `blockedAppCategories` | Array | Catégories bloquées |
| `totalPoints` | Integer | Points totaux (défaut: 0) |
| `totalStars` | Integer | Étoiles totales (défaut: 0) |
| `currentStreak` | Integer | Série actuelle (défaut: 0) |
| `createdAt` | DateTime | Date de création |
| `updatedAt` | DateTime | Date de mise à jour |

### Index

- `(parentId)`
- `(parentId, createdAt)`

### Relations

- Foreign key vers `User(id)` avec `onDelete: Cascade`

## 🧪 Tests Post-Migration

### 1. Test de Création

```bash
# Ouvrir Prisma Studio
npx prisma studio

# Créer manuellement un profil enfant pour tester
```

### 2. Test API

```bash
# Démarrer le serveur
npm start

# Dans un autre terminal, tester l'API
curl http://localhost:8081/api/child/[id]
```

### 3. Test Interface

1. Démarrer l'application Expo
2. Naviguer vers la section parent
3. Accéder à la liste des enfants
4. Créer ou modifier un profil enfant
5. Vérifier la sauvegarde des préférences

## ⚠️ Problèmes Potentiels

### Erreur: "Prisma Client not found"

**Solution**:
```bash
npm run db:generate
```

### Erreur: "Migration failed"

**Solution**:
```bash
# Réinitialiser la base de données (ATTENTION: perte de données)
npx prisma migrate reset

# Ou appliquer les migrations en attente
npx prisma migrate deploy
```

### Erreur: "Type mismatch"

**Solution**:
```bash
# Régénérer le client Prisma
npm run db:generate
# Redémarrer le serveur
npm start
```

## 🔄 Rollback

Si vous devez annuler la migration:

```bash
# Lister les migrations
npx prisma migrate status

# Réinitialiser à une migration précédente
npx prisma migrate resolve --rolled-back [migration-name]
```

## 📊 Données de Test

Pour tester l'application, vous pouvez créer des données de test:

```typescript
// Exemple de seed.ts
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

async function main() {
  // Créer un utilisateur parent
  const parent = await prisma.user.create({
    data: {
      id: 'test-parent-1',
      name: 'Parent Test',
      email: 'parent@test.com',
      emailVerified: true,
    },
  });

  // Créer des profils enfants
  await prisma.childProfile.createMany({
    data: [
      {
        parentId: parent.id,
        name: 'Sophie',
        age: 8,
        difficultyLevel: 'EASY',
        exerciseTypes: ['MATH', 'READING', 'LOGIC', 'VOCABULARY'],
        timeRewardMinutes: 15,
        blockedAppCategories: [],
      },
      {
        parentId: parent.id,
        name: 'Lucas',
        age: 12,
        difficultyLevel: 'MEDIUM',
        exerciseTypes: ['MATH', 'LOGIC'],
        timeRewardMinutes: 20,
        blockedAppCategories: [],
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Exécuter le seed:
```bash
npx ts-node prisma/seed.ts
```

## ✅ Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Prisma installé et configuré
- [ ] Client Prisma généré
- [ ] Migration créée et appliquée
- [ ] Table `child_profiles` créée
- [ ] Index créés
- [ ] Relations vérifiées
- [ ] Données de test créées (optionnel)
- [ ] API testée
- [ ] Interface testée
- [ ] Documentation mise à jour

## 📞 Support

En cas de problème:
1. Consultez la documentation Prisma: https://www.prisma.io/docs
2. Vérifiez les logs de l'application
3. Consultez `docs/LES-80-implementation.md`

---

**Dernière mise à jour**: 2025-10-07
**Ticket**: LES-80
**Status**: Prêt pour déploiement