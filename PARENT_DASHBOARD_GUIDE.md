# Guide du Dashboard Parent - Sprint 5.1

## 🎯 Vue d'ensemble

Ce guide documente l'implémentation du dashboard parent avec le bouton de partage de téléphone (LES-87).

## 📂 Structure des fichiers créés

```
app/
├── (parent)/
│   ├── _layout.tsx           # Layout du groupe parent
│   └── dashboard.tsx         # Écran principal du dashboard

components/
├── parent/
│   ├── index.ts              # Barrel export
│   ├── PhoneSharingButton.tsx
│   ├── DashboardStats.tsx
│   ├── ConfirmationDialog.tsx
│   └── README.md

locales/
└── fr.json                   # Traductions mises à jour
```

## 🚀 Comment tester

### 1. Lancer l'application

```bash
npm start
```

### 2. Naviguer vers le dashboard

Dans votre code de navigation ou index, ajoutez:

```typescript
import { router } from 'expo-router';

// Pour naviguer vers le dashboard
router.push('/(parent)/dashboard');
```

### 3. Tester les fonctionnalités

#### Affichage du dashboard
- ✅ Le dashboard affiche 2 enfants mockés (Sophie et Lucas)
- ✅ Les statistiques montrent: 2 enfants, 12 exercices, 180 minutes

#### Boutons de partage
- ✅ Chaque bouton affiche le nom de l'enfant
- ✅ Les initiales apparaissent dans un cercle
- ✅ Les statistiques (étoiles, streak) sont visibles
- ✅ Le bouton est tactile (minimum 100px de hauteur)

#### Dialog de confirmation
1. Cliquez sur un bouton de partage (ex: Sophie)
2. Un dialog apparaît avec le message "Activer le mode Sophie ?"
3. Testez les deux boutons:
   - "Annuler" ferme le dialog
   - "Activer" ferme le dialog et log dans la console

## 🎨 Design System

### Couleurs utilisées

```typescript
const COLORS = {
  // Parent Mode
  parentPrimary: '#2C5F7C',    // Bleu apaisant
  parentBg: '#F5F7FA',         // Arrière-plan clair
  
  // Child Mode Accent
  childAccent: '#FF9A3C',      // Orange chaud
  
  // Neutral
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  white: '#FFFFFF',
};
```

### Composants

#### PhoneSharingButton
- **Taille:** 100px minimum de hauteur
- **Couleur:** Orange #FF9A3C
- **Shadow:** Profondeur importante pour attirer l'attention
- **Accessibilité:** Labels et hints pour VoiceOver

#### DashboardStats
- **Layout:** 3 cartes côte à côte
- **Icônes:** Emojis pour simplicité
- **Format:** Temps intelligent (min/h)

#### ConfirmationDialog
- **Type:** Modal avec overlay transparent
- **Animation:** Fade in/out
- **Actions:** Deux boutons (Annuler/Activer)

## 🔗 Intégration API (À faire)

Pour connecter à votre backend, modifiez `dashboard.tsx`:

### 1. Remplacer les données mockées

```typescript
// Avant (mock)
const mockChildren: ChildProfile[] = [...];

// Après (API)
import { useQuery } from 'votre-lib-query';

const { data: children, isLoading } = useQuery('/api/child/profile');
```

### 2. Récupérer les statistiques réelles

```typescript
const { data: stats } = useQuery('/api/parent/dashboard');
```

### 3. Activer le mode enfant

```typescript
const handleConfirmActivation = async () => {
  if (!selectedChild) return;

  try {
    const response = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        childId: selectedChild.id,
        deviceId: await getDeviceId() // À implémenter
      })
    });

    const session = await response.json();
    
    // Naviguer vers le mode enfant
    router.push('/(child)/exercise');
  } catch (error) {
    console.error('Erreur activation:', error);
    // Afficher un message d'erreur
  }
};
```

## 📱 Navigation

Pour ajouter la navigation depuis l'écran d'accueil:

```typescript
// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // Après vérification d'authentification
  return <Redirect href="/(parent)/dashboard" />;
}
```

## ✅ Critères d'acceptation (Status)

- ✅ Dashboard créé à `/app/(parent)/dashboard.tsx`
- ✅ Boutons grands et visibles pour chaque enfant
- ✅ Boutons stylés distinctement (orange, >60pt)
- ✅ Avatar/initiale affichée
- ✅ Support multi-enfants
- ✅ Dialog de confirmation fonctionnel
- ⏳ Action d'activation (TODO: API)
- ✅ Statistiques affichées
- ✅ Entièrement en français

## 🐛 Debugging

### Le dashboard ne s'affiche pas

Vérifiez que le layout parent est bien enregistré:

```typescript
// app/_layout.tsx
<Stack.Screen name="(parent)" options={{ headerShown: false }} />
```

### Erreurs d'import

Assurez-vous que les paths sont correctement configurés:

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Types manquants

Si TypeScript se plaint des types:

```bash
npm run db:generate  # Génère les types Prisma
```

## 📚 Ressources

- **Architecture:** `docs/architecture.md`
- **PRD:** `docs/prd.md` (Epic 5, Story 5.1)
- **Types:** `lib/types/index.ts`
- **Traductions:** `locales/fr.json`

## 🎯 Prochaines étapes

1. **Intégration API:**
   - Créer l'endpoint `/api/session/start`
   - Implémenter la récupération des enfants
   - Implémenter les statistiques du dashboard

2. **Navigation:**
   - Créer l'écran de mode enfant
   - Implémenter la transition de couleur
   - Gérer le retour avec PIN

3. **State Management:**
   - Ajouter un Context pour l'état de session
   - Persister l'état actif du mode enfant

4. **Tests:**
   - Tests unitaires des composants
   - Tests d'intégration API
   - Tests manuels sur device physique

## 💡 Conseils

- Les données mockées facilitent le développement et les tests visuels
- La structure modulaire permet de tester chaque composant indépendamment
- Les types TypeScript partagés garantissent la cohérence entre frontend et backend
- Les traductions centralisées simplifient la maintenance

---

**Créé pour:** LES-87 - Sprint 5.1: Design Parent Dashboard with Phone Sharing Button  
**Date:** 2025-10-07  
**Status:** ✅ Implémentation complète (maquette fonctionnelle)