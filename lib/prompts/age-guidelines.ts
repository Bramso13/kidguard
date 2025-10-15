/**
 * Guidelines de complexité par tranche d'âge
 * Story 3.2: Design Exercise Generation Prompts
 * 
 * Ces guidelines informent les prompts DeepSeek pour générer
 * des exercices adaptés au niveau cognitif de chaque âge.
 */

import { AgeGuidelines, AgeRange } from './types';

export const AGE_GUIDELINES: Record<AgeRange, AgeGuidelines> = {
  '6-8': {
    ageRange: '6-8',
    cognitiveLevel: 'Pensée concrète, début de la logique simple',
    attention: 'Durée d\'attention courte (5-10 minutes)',
    languageLevel: 'Vocabulaire de base (500-1500 mots), phrases simples',
    mathLevel: 'Addition/soustraction simple (0-20), début de la multiplication',
    readingLevel: 'Mots simples, phrases courtes (3-7 mots)',
    examples: [
      'Compter des objets',
      'Lire des mots simples',
      'Patterns visuels basiques',
      'Catégorisation d\'images'
    ]
  },
  '9-11': {
    ageRange: '9-11',
    cognitiveLevel: 'Pensée logique, raisonnement séquentiel',
    attention: 'Durée d\'attention moyenne (15-25 minutes)',
    languageLevel: 'Vocabulaire élargi (2000-4000 mots), phrases complexes',
    mathLevel: 'Multiplication/division, fractions simples, problèmes à plusieurs étapes',
    readingLevel: 'Paragraphes courts, compréhension de textes narratifs',
    examples: [
      'Résolution de problèmes mathématiques',
      'Compréhension de lecture de passages courts',
      'Logique déductive simple',
      'Synonymes et antonymes'
    ]
  },
  '12-14': {
    ageRange: '12-14',
    cognitiveLevel: 'Pensée abstraite, raisonnement hypothétique',
    attention: 'Durée d\'attention prolongée (30+ minutes)',
    languageLevel: 'Vocabulaire avancé (5000+ mots), structures grammaticales complexes',
    mathLevel: 'Algèbre de base, géométrie, pourcentages, proportions',
    readingLevel: 'Textes longs, analyse littéraire, compréhension nuancée',
    examples: [
      'Résolution d\'équations algébriques',
      'Analyse de textes complexes',
      'Raisonnement logique avancé',
      'Nuances de langage et expressions idiomatiques'
    ]
  }
};

/**
 * Obtenir les guidelines pour une tranche d'âge
 */
export function getAgeGuidelines(ageRange: AgeRange): AgeGuidelines {
  return AGE_GUIDELINES[ageRange];
}

/**
 * Obtenir les guidelines pour un âge spécifique
 */
export function getGuidelinesForAge(age: number): AgeGuidelines {
  if (age >= 6 && age <= 8) return AGE_GUIDELINES['6-8'];
  if (age >= 9 && age <= 11) return AGE_GUIDELINES['9-11'];
  if (age >= 12 && age <= 14) return AGE_GUIDELINES['12-14'];
  
  // Par défaut, retourner le niveau moyen
  return AGE_GUIDELINES['9-11'];
}

/**
 * Niveaux de leniency pour la validation par âge
 */
export const LENIENCY_LEVELS: Record<AgeRange, string> = {
  '6-8': `TRÈS TOLÉRANT:
- Accepte les variations orthographiques phonétiques
- Accepte les synonymes simples
- Accepte les réponses partiellement correctes
- Ignore la casse et les accents
- Pour les mathématiques: accepte différents formats (8, huit, 8.0)`,

  '9-11': `MODÉRÉMENT TOLÉRANT:
- Accepte les synonymes
- Tolère les erreurs d'orthographe mineures (1-2 lettres)
- Accepte les réponses partielles si l'idée principale est correcte
- Respecte la casse et les accents mais avec tolérance
- Pour les mathématiques: accepte les formats numériques variés`,

  '12-14': `TOLÉRANCE STANDARD:
- Accepte les synonymes exacts
- Tolère les erreurs d'orthographe mineures
- Exige une réponse complète mais accepte différentes formulations
- Respecte la casse et les accents (avec petite tolérance)
- Pour les mathématiques: exige la précision mais accepte notation scientifique`
};

/**
 * Obtenir le niveau de leniency pour une tranche d'âge
 */
export function getLeniencyLevel(ageRange: AgeRange): string {
  return LENIENCY_LEVELS[ageRange];
}
