# LES-80: Configuration des Préférences d'Exercices pour Enfants

## 📋 Résumé

Cette fonctionnalité permet aux parents de configurer les préférences d'exercices pour chaque enfant, incluant:
- Sélection des types d'exercices (Mathématiques, Lecture, Logique, Vocabulaire)
- Configuration du niveau de difficulté
- Définition du temps de récompense par exercice

## ✅ Critères d'Acceptation Implémentés

1. ✅ Section de préférences d'exercices ajoutée au profil enfant
2. ✅ Checkboxes pour les types d'exercices: Math, Lecture, Logique, Vocabulaire
3. ✅ Validation: au moins un type doit être sélectionné
4. ✅ Préférences sauvegardées dans le modèle ChildProfile
5. ✅ Par défaut: tous les types d'exercices activés
6. ✅ Sauvegarde immédiate avec confirmation visuelle
7. ✅ Labels et descriptions en français

## 📁 Fichiers Créés/Modifiés

### 1. Schéma Base de Données
- **Fichier**: `prisma/schema.prisma`
- **Modifications**:
  - Ajout du modèle `ChildProfile` avec les champs:
    - `exerciseTypes`: tableau des types d'exercices sélectionnés
    - `difficultyLevel`: niveau de difficulté (EASY, MEDIUM, HARD)
    - `timeRewardMinutes`: temps de récompense par exercice (5-60 min)
  - Ajout des enums `DifficultyLevel` et `ExerciseType`
  - Relation avec le modèle `User` (parent)

### 2. Route API
- **Fichier**: `app/api/child/[id]+api.ts`
- **Endpoints**:
  - `GET /api/child/[id]`: Récupère un profil enfant
  - `PUT /api/child/[id]`: Met à jour le profil enfant
- **Validations**:
  - Au moins un type d'exercice requis
  - Âge entre 6 et 14 ans
  - Temps de récompense entre 5 et 60 minutes

### 3. Interface Utilisateur
- **Fichier**: `app/(parent)/children/[id].tsx`
- **Fonctionnalités**:
  - Formulaire d'édition du profil enfant
  - Section préférences d'exercices avec checkboxes
  - Sélection du niveau de difficulté
  - Configuration du temps de récompense
  - Validation en temps réel
  - Messages de confirmation en français

### 4. Fichiers Supplémentaires
- `app/(parent)/children/index.tsx`: Liste des enfants
- `app/(parent)/_layout.tsx`: Layout de navigation pour la section parent

## 🎨 Design

### Palette de Couleurs (Mode Parent)
- Principal: `#4A90E2` (Bleu apaisant)
- Fond: `#F5F7FA` (Gris très clair)
- Texte principal: `#2C3E50`
- Texte secondaire: `#7F8C8D`

### Composants UI
- Checkboxes interactives pour les types d'exercices
- Boutons de sélection pour le niveau de difficulté
- Inputs de formulaire avec validation
- Messages d'alerte pour la confirmation

## 🔐 Validation et Sécurité

### Validation Côté Client
- Nom requis
- Âge entre 6 et 14 ans
- Au moins un type d'exercice sélectionné
- Temps de récompense entre 5 et 60 minutes

### Validation Côté Serveur
- Validation identique côté API
- Messages d'erreur en français
- Gestion des erreurs de base de données

## 📝 Types d'Exercices Disponibles

| Type | Label Français | Description |
|------|---------------|-------------|
| `math` | Mathématiques | Calculs, problèmes mathématiques |
| `reading` | Lecture | Compréhension de textes |
| `logic` | Logique | Énigmes et casse-têtes |
| `vocabulary` | Vocabulaire | Mots et définitions |

## 📊 Niveaux de Difficulté

| Niveau | Label | Recommandation d'Âge |
|--------|-------|---------------------|
| `easy` | Facile | 6-8 ans |
| `medium` | Moyen | 9-11 ans |
| `hard` | Difficile | 12-14 ans |

## 🧪 Tests à Effectuer

### Tests Manuels
1. **Navigation**: Vérifier que la navigation fonctionne depuis la liste vers le profil
2. **Chargement**: Vérifier que les données existantes se chargent correctement
3. **Sélection types**: Tester la sélection/désélection des types d'exercices
4. **Validation minimum**: Vérifier qu'on ne peut pas déselectionner tous les types
5. **Difficulté**: Tester la sélection des différents niveaux
6. **Sauvegarde**: Vérifier que la sauvegarde fonctionne avec confirmation
7. **Messages erreur**: Tester les cas d'erreur (âge invalide, etc.)

### Tests API
```bash
# Récupérer un profil
curl http://localhost:8081/api/child/[id]

# Mettre à jour les préférences
curl -X PUT http://localhost:8081/api/child/[id] \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sophie",
    "age": 8,
    "difficultyLevel": "easy",
    "exerciseTypes": ["math", "reading"],
    "timeRewardMinutes": 15
  }'
```

## 🚀 Prochaines Étapes

1. **Migration Base de Données**: Exécuter `npm run db:migrate` pour créer les tables
2. **Tests Unitaires**: Ajouter des tests pour la validation
3. **Tests d'Intégration**: Tester le flux complet parent → enfant
4. **Accessibilité**: Vérifier la compatibilité avec les lecteurs d'écran
5. **Documentation API**: Compléter la documentation OpenAPI

## 🐛 Points d'Attention

- ⚠️ Prisma Client doit être généré après modification du schéma
- ⚠️ La migration de base de données doit être exécutée
- ⚠️ Les types TypeScript doivent correspondre au schéma Prisma
- ⚠️ La validation côté serveur est obligatoire pour la sécurité

## 📚 Références

- Architecture: `docs/architecture.md` (section Data Models)
- PRD: `docs/prd.md` (Story 2.5)
- Brief: `docs/brief.md` (Exercise configuration requirements)