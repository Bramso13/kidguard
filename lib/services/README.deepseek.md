# Service DeepSeek - Documentation

## Vue d'ensemble

Le service DeepSeek (`/lib/services/deepseek.ts`) fournit une intégration complète avec l'API DeepSeek pour la génération d'exercices éducatifs en français et la validation de réponses d'enfants.

## Fonctionnalités principales

✅ **Génération d'exercices**
- Exercices adaptatés à l'âge (6-14 ans)
- 4 types de sujets: math, lecture, logique, vocabulaire
- 3 niveaux de difficulté: facile, moyen, difficile
- Contenu ludique et engageant en français

✅ **Validation de réponses**
- Tolérance adaptée à l'âge de l'enfant
- Accepte les synonymes, fautes d'orthographe, formulations différentes
- Feedback encourageant en français
- Détection automatique de la pertinence

✅ **Gestion d'erreurs robuste**
- Détection des erreurs réseau
- Gestion des rate limits
- Gestion des timeouts
- Classification des erreurs retryables

✅ **Retry logic avec exponential backoff**
- Maximum 3 tentatives
- Délais: 1s, 2s, 4s
- Interruption sur erreurs non-retryables

✅ **Monitoring et métriques**
- Tracking des coûts par requête
- Temps de réponse
- Taux d'erreur
- Utilisation des tokens

## Installation

### 1. Installer les dépendances

Les dépendances nécessaires sont déjà présentes dans `package.json` (fetch API natif).

### 2. Configuration

Créer un fichier `.env` à la racine du projet:

```bash
cp .env.example .env
```

Obtenir une clé API DeepSeek:
1. Créer un compte sur https://platform.deepseek.com/
2. Obtenir une clé API
3. Ajouter la clé dans `.env`:

```env
DEEPSEEK_API_KEY=sk-your-key-here
```

## Utilisation

### Génération d'exercices

```typescript
import { DeepSeekService } from '@/lib/services/deepseek';

const service = new DeepSeekService(process.env.DEEPSEEK_API_KEY!);

// Générer 3 exercices de mathématiques faciles pour un enfant de 8 ans
const exercises = await service.generateExercises({
  childAge: 8,
  difficulty: 'easy',
  exerciseType: 'math',
  count: 3,
});

exercises.forEach(exercise => {
  console.log('Question:', exercise.question);
  console.log('Réponse:', exercise.correctAnswer);
  console.log('Indices:', exercise.hints);
});
```

### Validation de réponse

```typescript
// Valider la réponse d'un enfant
const result = await service.validateAnswer({
  question: "Combien font 5 + 3?",
  correctAnswer: "8",
  childAnswer: "huit", // L'enfant a écrit en lettres
  childAge: 7,
  exerciseType: 'math',
});

if (result.isCorrect) {
  console.log('✓ Bonne réponse!');
  console.log('Feedback:', result.feedback);
} else {
  console.log('✗ Réponse incorrecte');
  console.log('Feedback:', result.feedback);
}

if (result.leniencyApplied) {
  console.log('⚠️ Tolérance appliquée');
}
```

### Utilisation du singleton

```typescript
import { getDeepSeekService } from '@/lib/services/deepseek';

// Récupère ou crée l'instance
const service = getDeepSeekService(); // Utilise process.env.DEEPSEEK_API_KEY

// L'instance est partagée dans toute l'application
const exercises = await service.generateExercises({...});
```

### Monitoring des métriques

```typescript
// Obtenir les statistiques agrégées
const stats = service.getStats();

console.log('Requêtes totales:', stats.totalRequests);
console.log('Taux de succès:', stats.successRate, '%');
console.log('Coût total:', stats.totalCost, 'USD');
console.log('Temps de réponse moyen:', stats.avgResponseTime, 'ms');
console.log('Tokens utilisés:', stats.totalTokens);

// Obtenir les métriques détaillées
const metrics = service.getMetrics();
metrics.forEach(metric => {
  console.log(metric.timestamp, metric.operation, metric.responseTimeMs, 'ms');
});

// Réinitialiser les métriques
service.clearMetrics();
```

## Types d'exercices

### Math (`math`)
- Additions, soustractions, multiplications, divisions
- Problèmes simples
- Géométrie de base (pour les plus âgés)

### Lecture (`reading`)
- Compréhension de texte court
- Questions sur un passage
- Vocabulaire en contexte

### Logique (`logic`)
- Énigmes
- Suites logiques
- Déductions simples
- Puzzles

### Vocabulaire (`vocabulary`)
- Synonymes et antonymes
- Définitions
- Mots croisés simplifiés
- Familles de mots

## Niveaux de difficulté

### Facile (`easy`)
- Pour enfants 6-8 ans
- Notions de base
- Questions simples et directes
- Vocabulaire courant

### Moyen (`medium`)
- Pour enfants 9-11 ans
- Questions intermédiaires
- Réflexion modérée requise
- Vocabulaire scolaire

### Difficile (`hard`)
- Pour enfants 12-14 ans
- Questions avancées
- Réflexion approfondie
- Vocabulaire enrichi

## Tolérance par âge

### 6-8 ans - Très tolérant
- ✅ Fautes d'orthographe phonétiques
- ✅ Synonymes simples
- ✅ Réponses partielles correctes
- ✅ Différents formats (ex: "8" ou "huit")

### 9-11 ans - Modérément tolérant
- ✅ Synonymes
- ✅ Petites erreurs d'orthographe
- ⚠️ Orthographe approximative acceptable

### 12-14 ans - Tolérant mais précis
- ✅ Synonymes
- ⚠️ Orthographe correcte préférée
- ⚠️ Formulation précise attendue

## Gestion des erreurs

Le service gère automatiquement plusieurs types d'erreurs:

### Erreurs retryables (3 tentatives max)
- `DeepSeekRateLimitError` - Rate limit dépassé
- `DeepSeekTimeoutError` - Timeout de requête
- `DeepSeekNetworkError` - Erreur réseau
- Erreurs serveur 5xx

### Erreurs non-retryables
- Erreurs d'authentification (401)
- Erreurs de validation (400)
- Clé API invalide

### Exemple de gestion d'erreur

```typescript
try {
  const exercises = await service.generateExercises({...});
} catch (error) {
  if (error instanceof DeepSeekRateLimitError) {
    console.error('Rate limit atteint, réessayer plus tard');
  } else if (error instanceof DeepSeekTimeoutError) {
    console.error('Timeout, connexion lente?');
  } else if (error instanceof DeepSeekNetworkError) {
    console.error('Erreur réseau, vérifier la connexion');
  } else {
    console.error('Erreur inconnue:', error);
  }
}
```

## Configuration avancée

```typescript
const service = new DeepSeekService(apiKey, {
  baseUrl: 'https://api.deepseek.com/v1', // URL de base
  model: 'deepseek-chat', // Modèle à utiliser
  maxRetries: 3, // Nombre max de tentatives
  timeout: 30000, // Timeout en ms (30s)
});
```

## Coûts

Les prix DeepSeek (très compétitifs):
- **Input tokens**: $0.14 / 1M tokens
- **Output tokens**: $0.28 / 1M tokens

Estimation pour 1000 utilisateurs actifs:
- ~$2-5 par mois avec stratégie de cache
- ~$10-20 par mois sans cache

## Métriques surveillées

Le service track automatiquement:

- ✅ Temps de réponse API (objectif: <2s génération, <3s validation)
- ✅ Coût par requête
- ✅ Taux d'erreur
- ✅ Utilisation des tokens
- ✅ Types d'erreurs rencontrées

## Tests

### Test rapide

```bash
# Installer ts-node si nécessaire
npm install -g ts-node

# Exécuter le script de test
ts-node scripts/test-deepseek.ts
```

### Test avec Jest

```typescript
import { DeepSeekService } from '@/lib/services/deepseek';

describe('DeepSeekService', () => {
  it('devrait générer des exercices', async () => {
    const service = new DeepSeekService(process.env.DEEPSEEK_API_KEY!);
    const exercises = await service.generateExercises({
      childAge: 8,
      difficulty: 'easy',
      exerciseType: 'math',
      count: 1,
    });
    expect(exercises).toHaveLength(1);
    expect(exercises[0].question).toBeTruthy();
  });
});
```

## Critères d'acceptation (Story 3.1)

✅ **1. DeepSeek API credentials obtained and stored securely in `.env`**
- Fichier `.env.example` créé avec documentation
- Variable `DEEPSEEK_API_KEY` configurée

✅ **2. DeepSeek SDK or HTTP client library installed**
- Utilisation du Fetch API natif (pas de dépendance externe)

✅ **3. Service module created: `/lib/services/deepseek.ts`**
- Module complet créé avec toutes les fonctionnalités

✅ **4. API connection tested with simple prompt/response**
- Script de test fourni dans `scripts/test-deepseek.ts`

✅ **5. Error handling implemented**
- Gestion des network failures
- Gestion des rate limits
- Gestion des timeouts

✅ **6. Retry logic implemented (max 3 retries with exponential backoff)**
- Implémenté avec délais: 1s, 2s, 4s

✅ **7. API response time logging for monitoring**
- Métriques détaillées enregistrées pour chaque requête

✅ **8. Cost tracking utility function created**
- Calcul des coûts par requête
- Statistiques agrégées disponibles

## Prochaines étapes

1. **Story 3.2**: Créer les templates de prompts pour chaque type d'exercice
2. **Story 3.3**: Intégrer le service dans les API routes
3. **Story 3.4**: Implémenter le cache Redis
4. **Story 3.5**: Créer la banque d'exercices de fallback

## Support

Pour toute question ou problème:
- Consulter la documentation DeepSeek: https://platform.deepseek.com/docs
- Vérifier les logs dans la console
- Consulter les métriques avec `service.getStats()`
