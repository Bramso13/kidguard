# Prompts de Génération d'Exercices - Documentation

## 📋 Vue d'ensemble

Ce module contient tous les templates de prompts pour générer des exercices éducatifs en français avec DeepSeek AI, conformément à la Story 3.2 du PRD.

## 🎯 Objectifs

- Générer des exercices adaptés à l'âge et au niveau de difficulté
- Valider les réponses avec une tolérance appropriée à l'âge
- Fournir des hints progressifs pour aider les enfants
- Assurer un contenu 100% en français
- Maintenir un style ludique et engageant

## 📁 Structure des fichiers

```
/lib/prompts/
├── types.ts                 # Types TypeScript
├── age-guidelines.ts        # Guidelines par tranche d'âge
├── math-prompts.ts          # Prompts pour mathématiques
├── reading-prompts.ts       # Prompts pour lecture
├── logic-prompts.ts         # Prompts pour logique
├── vocabulary-prompts.ts    # Prompts pour vocabulaire
├── index.ts                 # Point d'entrée principal
└── README.md               # Cette documentation
```

## 🧒 Tranches d'âge

### 6-8 ans
- **Cognitif**: Pensée concrète
- **Attention**: 5-10 minutes
- **Langage**: 500-1500 mots
- **Math**: Addition/soustraction (0-20)
- **Lecture**: Phrases de 3-7 mots

### 9-11 ans
- **Cognitif**: Pensée logique
- **Attention**: 15-25 minutes
- **Langage**: 2000-4000 mots
- **Math**: 4 opérations, fractions simples
- **Lecture**: Paragraphes courts

### 12-14 ans
- **Cognitif**: Pensée abstraite
- **Attention**: 30+ minutes
- **Langage**: 5000+ mots
- **Math**: Algèbre, géométrie
- **Lecture**: Textes complexes

## 📚 Types d'exercices

### 1. Mathématiques (`math`)

**Exemples par niveau:**

**Facile (6-8 ans):**
```json
{
  "question": "🍎 Sophie a cueilli 7 pommes rouges et 5 pommes vertes dans son jardin. Combien de pommes a-t-elle en tout?",
  "answer": "12",
  "hints": [
    "Compte toutes les pommes ensemble",
    "7 pommes rouges + 5 pommes vertes",
    "7 + 5 = ?"
  ],
  "type": "math",
  "difficulty": "easy",
  "ageRange": "6-8"
}
```

**Moyen (9-11 ans):**
```json
{
  "question": "🎮 Léo a économisé 45€ pour acheter un jeu vidéo à 28€. Combien d'argent lui restera-t-il après l'achat?",
  "answer": "17",
  "hints": [
    "Il faut soustraire le prix du jeu de ses économies",
    "45€ - 28€",
    "Pense à compter: 45 - 28 = ?"
  ],
  "type": "math",
  "difficulty": "medium",
  "ageRange": "9-11"
}
```

**Difficile (12-14 ans):**
```json
{
  "question": "🚴 Emma fait du vélo à une vitesse moyenne de 15 km/h. Si elle roule pendant 2 heures et demie, quelle distance parcourt-elle?",
  "answer": "37.5",
  "hints": [
    "Distance = Vitesse × Temps",
    "2 heures et demie = 2.5 heures",
    "15 km/h × 2.5 heures = ?"
  ],
  "type": "math",
  "difficulty": "hard",
  "ageRange": "12-14"
}
```

### 2. Lecture (`reading`)

**Exemple (6-8 ans):**
```json
{
  "question": "🐱 Le petit chat Minou aime jouer dans le jardin. Il court après les papillons. Maman chat l'appelle pour manger.\n\nQuestion: Où joue Minou?",
  "answer": "dans le jardin",
  "hints": [
    "Relis la première phrase",
    "Cherche où le chat aime jouer",
    "Le chat joue dans le..."
  ],
  "type": "reading",
  "difficulty": "easy",
  "ageRange": "6-8"
}
```

### 3. Logique (`logic`)

**Exemple (9-11 ans):**
```json
{
  "question": "🐱 Trois amis ont des animaux différents: un chat, un chien et un poisson.\n- Julie n'a pas de chat\n- Marc a un animal qui nage\n- Sophie adore les félins\n\nQui a le chien?",
  "answer": "Julie",
  "hints": [
    "Marc a le poisson (il nage)",
    "Sophie a le chat (c'est un félin)",
    "Il reste donc..."
  ],
  "type": "logic",
  "difficulty": "medium",
  "ageRange": "9-11"
}
```

### 4. Vocabulaire (`vocabulary`)

**Exemple (6-8 ans):**
```json
{
  "question": "📚 Trouve un autre mot qui veut dire la même chose que 'content'",
  "answer": "joyeux",
  "hints": [
    "Pense à comment tu te sens quand tu es content",
    "C'est un mot qui exprime le bonheur",
    "On dit aussi: être ___"
  ],
  "type": "vocabulary",
  "difficulty": "easy",
  "ageRange": "6-8"
}
```

## 🔧 Utilisation

### Générer un exercice

```typescript
import { getPromptTemplate } from '@/lib/prompts';

// 1. Récupérer le template
const template = getPromptTemplate('math');

// 2. Préparer les paramètres
const params = {
  ageRange: '9-11' as const,
  difficulty: 'medium' as const,
  subject: 'math' as const
};

// 3. Générer les prompts
const systemPrompt = template.systemPrompt;
const userPrompt = template.userPromptTemplate(params);

// 4. Appeler DeepSeek
const response = await callDeepSeek({
  system: systemPrompt,
  user: userPrompt,
  temperature: 0.7,
  maxTokens: 500
});

// 5. Parser la réponse JSON
const exercise = JSON.parse(response);
```

### Valider une réponse

```typescript
import { getPromptTemplate } from '@/lib/prompts';

// 1. Récupérer le template
const template = getPromptTemplate('math');

// 2. Préparer les paramètres de validation
const validationParams = {
  question: "Combien font 5 + 3 ?",
  correctAnswer: "8",
  childAnswer: "huit",
  ageRange: '6-8' as const,
  exerciseType: 'math' as const
};

// 3. Générer le prompt de validation
const validationPrompt = template.validationPromptTemplate(validationParams);

// 4. Appeler DeepSeek
const response = await callDeepSeek({
  user: validationPrompt,
  temperature: 0.3, // Plus déterministe pour validation
  maxTokens: 200
});

// 5. Parser le résultat
const validation = JSON.parse(response);
console.log(validation.isCorrect); // true
console.log(validation.feedback); // "Bravo ! C'est la bonne réponse !"
```

## 🎨 Niveaux de tolérance (Leniency)

### 6-8 ans: TRÈS TOLÉRANT
- Accepte variations phonétiques
- Accepte synonymes simples
- Ignore casse et accents
- Pour math: accepte "8", "huit", "8.0"

### 9-11 ans: MODÉRÉMENT TOLÉRANT
- Accepte synonymes
- Tolère 1-2 erreurs d'orthographe
- Respecte casse/accents avec tolérance

### 12-14 ans: TOLÉRANCE STANDARD
- Accepte synonymes exacts
- Tolère erreurs mineures
- Exige précision mais reste bienveillant

## ✅ Critères d'acceptation validés

- ✅ Prompt templates pour Math, Reading, Logic, Vocabulary
- ✅ Paramètres: age range, difficulty, subject
- ✅ Format de sortie: JSON avec question, answer, hints, type, difficulty, ageRange
- ✅ Instructions en français intégrées
- ✅ Guidelines de complexité par âge (6-8, 9-11, 12-14)
- ✅ Templates stockés dans `/lib/prompts/`
- ✅ Exemples documentés pour chaque type
- ⏳ Tests avec DeepSeek API (à faire)

## 🧪 Tests recommandés

### Test manuel avec DeepSeek

1. **Test de génération**: Générer 3 exercices par type et vérifier la qualité
2. **Test de validation**: Tester différentes variantes de réponses
3. **Test de tolérance**: Vérifier le leniency par âge
4. **Test de français**: Vérifier la qualité linguistique

### Script de test

```typescript
import { PROMPT_TEMPLATES } from '@/lib/prompts';

// Tester tous les types d'exercices
for (const [type, template] of Object.entries(PROMPT_TEMPLATES)) {
  console.log(`\n=== Test ${type} ===`);
  
  const params = {
    ageRange: '9-11' as const,
    difficulty: 'medium' as const,
    subject: type as any
  };
  
  const userPrompt = template.userPromptTemplate(params);
  console.log('Prompt:', userPrompt);
  
  // Appeler DeepSeek et afficher le résultat...
}
```

## 📊 Métriques de qualité attendues

- **Variété**: Pas de répétition dans 100 exercices consécutifs
- **Pertinence**: 95%+ d'exercices appropriés à l'âge
- **Français**: 100% de contenu en français correct
- **Validation**: 95%+ de précision dans la validation
- **Temps de réponse**: <2s pour génération, <3s pour validation

## 🔗 Références

- **Architecture**: `docs/architecture.md` (section External APIs)
- **PRD**: `docs/prd.md` (Story 3.2)
- **Brief**: `docs/brief.md` (AI Integration requirements)

## 📝 Notes d'implémentation

- Les prompts sont conçus pour DeepSeek (modèle deepseek-chat)
- Temperature recommandée: 0.7 pour génération, 0.3 pour validation
- Max tokens: 500 pour génération, 200 pour validation
- Toujours parser le JSON avec gestion d'erreur
- Implémenter un système de fallback si DeepSeek échoue
