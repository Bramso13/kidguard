/**
 * Service DeepSeek - Intégration complète de l'API DeepSeek
 * 
 * Fonctionnalités:
 * - Génération d'exercices éducatifs en français
 * - Validation de réponses avec leniency adaptée à l'âge
 * - Gestion d'erreurs robuste (network, rate limits, timeouts)
 * - Retry logic avec exponential backoff
 * - Tracking des coûts et métriques
 * - Logging des temps de réponse
 */

import {
  DeepSeekConfig,
  DeepSeekChatRequest,
  DeepSeekChatResponse,
  DeepSeekError,
  DeepSeekRateLimitError,
  DeepSeekTimeoutError,
  DeepSeekNetworkError,
  ExerciseGenerationParams,
  GeneratedExercise,
  AnswerValidationParams,
  AnswerValidationResult,
  DeepSeekMetrics,
  CostCalculation,
} from '../types/deepseek';

// Configuration par défaut
const DEFAULT_CONFIG: Partial<DeepSeekConfig> = {
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
  maxRetries: 3,
  timeout: 30000, // 30 secondes
};

// Prix DeepSeek (en USD par 1M tokens)
const PRICING = {
  promptTokenPrice: 0.14 / 1_000_000,
  completionTokenPrice: 0.28 / 1_000_000,
};

/**
 * Service principal DeepSeek
 */
export class DeepSeekService {
  private config: DeepSeekConfig;
  private metrics: DeepSeekMetrics[] = [];

  constructor(apiKey: string, config?: Partial<DeepSeekConfig>) {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('DeepSeek API key is required');
    }

    this.config = {
      apiKey,
      baseUrl: config?.baseUrl || DEFAULT_CONFIG.baseUrl!,
      model: config?.model || DEFAULT_CONFIG.model!,
      maxRetries: config?.maxRetries ?? DEFAULT_CONFIG.maxRetries!,
      timeout: config?.timeout ?? DEFAULT_CONFIG.timeout!,
    };
  }

  /**
   * Appel API DeepSeek avec retry logic
   */
  private async callApi(
    request: DeepSeekChatRequest,
    operation: 'generate' | 'validate'
  ): Promise<DeepSeekChatResponse> {
    const startTime = Date.now();
    const requestId = `${operation}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt < this.config.maxRetries) {
      attempt++;
      
      try {
        const response = await this.makeRequest(request);
        
        // Succès - calculer les métriques
        const responseTime = Date.now() - startTime;
        const metrics = this.createMetrics(
          requestId,
          operation,
          response,
          responseTime,
          true
        );
        this.metrics.push(metrics);

        console.log(`[DeepSeek] Succès ${operation} en ${responseTime}ms (tentative ${attempt}/${this.config.maxRetries})`);
        
        return response;
      } catch (error) {
        lastError = error as Error;
        
        // Vérifier si l'erreur est retryable
        const isRetryable = error instanceof DeepSeekError && error.retryable;
        
        if (!isRetryable || attempt >= this.config.maxRetries) {
          // Échec final - enregistrer les métriques
          const responseTime = Date.now() - startTime;
          const metrics = this.createFailureMetrics(
            requestId,
            operation,
            responseTime,
            error as Error
          );
          this.metrics.push(metrics);

          console.error(`[DeepSeek] Échec ${operation} après ${attempt} tentatives: ${lastError.message}`);
          throw lastError;
        }

        // Calculer le délai d'exponential backoff
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
        
        console.warn(`[DeepSeek] Tentative ${attempt} échouée, retry dans ${backoffDelay}ms: ${lastError.message}`);
        
        await this.sleep(backoffDelay);
      }
    }

    throw lastError || new DeepSeekError('Max retries exceeded');
  }

  /**
   * Effectue la requête HTTP vers l'API DeepSeek
   */
  private async makeRequest(request: DeepSeekChatRequest): Promise<DeepSeekChatResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return data as DeepSeekChatResponse;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new DeepSeekTimeoutError(`Request timeout after ${this.config.timeout}ms`);
        }
        if (error.message.includes('fetch') || error.message.includes('network')) {
          throw new DeepSeekNetworkError(`Network error: ${error.message}`);
        }
      }

      throw error;
    }
  }

  /**
   * Gère les réponses d'erreur HTTP
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch {
      // Ignore JSON parse errors
    }

    if (response.status === 429) {
      throw new DeepSeekRateLimitError(errorMessage);
    }

    if (response.status >= 500) {
      throw new DeepSeekError(errorMessage, response.status, true);
    }

    throw new DeepSeekError(errorMessage, response.status, false);
  }

  /**
   * Génère des exercices éducatifs
   */
  async generateExercises(params: ExerciseGenerationParams): Promise<GeneratedExercise[]> {
    const { childAge, difficulty, exerciseType, count = 1 } = params;

    const prompt = this.buildGenerationPrompt(childAge, difficulty, exerciseType, count);
    
    const request: DeepSeekChatRequest = {
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant pédagogique français expert en création d\'exercices ludiques pour enfants. Tu génères du contenu éducatif adapté à l\'âge et au niveau de difficulté demandé. Réponds toujours en JSON valide.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8, // Créativité pour varier les exercices
      max_tokens: 2000,
    };

    const response = await this.callApi(request, 'generate');
    
    return this.parseExercisesResponse(response);
  }

  /**
   * Valide la réponse d'un enfant
   */
  async validateAnswer(params: AnswerValidationParams): Promise<AnswerValidationResult> {
    const { question, correctAnswer, childAnswer, childAge, exerciseType } = params;

    const prompt = this.buildValidationPrompt(
      question,
      correctAnswer,
      childAnswer,
      childAge,
      exerciseType
    );

    const request: DeepSeekChatRequest = {
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content: 'Tu es un correcteur bienveillant qui évalue les réponses d\'enfants. Tu appliques une tolérance adaptée à leur âge pour les fautes d\'orthographe, les synonymes, et les formulations différentes. Tu donnes toujours un feedback encourageant en français. Réponds en JSON valide.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Cohérence dans la validation
      max_tokens: 500,
    };

    const response = await this.callApi(request, 'validate');
    
    return this.parseValidationResponse(response);
  }

  /**
   * Construit le prompt de génération d'exercices
   */
  private buildGenerationPrompt(
    age: number,
    difficulty: string,
    type: string,
    count: number
  ): string {
    const ageRange = age <= 8 ? '6-8 ans' : age <= 11 ? '9-11 ans' : '12-14 ans';
    
    const typeDescriptions: Record<string, string> = {
      math: 'mathématiques (calculs, problèmes, géométrie)',
      reading: 'lecture (compréhension, vocabulaire, questions sur un texte)',
      logic: 'logique (énigmes, suites, déductions)',
      vocabulary: 'vocabulaire (synonymes, antonymes, définitions)',
    };

    const difficultyDescriptions: Record<string, string> = {
      easy: 'facile - notions de base, questions simples',
      medium: 'moyen - questions intermédiaires, réflexion modérée',
      hard: 'difficile - questions avancées, réflexion approfondie',
    };

    return `Génère ${count} exercice(s) de ${typeDescriptions[type]} en français, niveau ${difficultyDescriptions[difficulty]}, pour un enfant de ${age} ans (tranche ${ageRange}).

Chaque exercice doit être:
- Ludique et engageant, comme un mini-jeu
- Adapté au niveau de l'enfant
- Formulé clairement en français
- Avec une réponse précise
- Accompagné de 2-3 indices progressifs

Réponds au format JSON suivant:
{
  "exercises": [
    {
      "question": "La question de l'exercice",
      "correctAnswer": "La réponse attendue",
      "hints": ["Indice 1", "Indice 2", "Indice 3"],
      "topic": "Le sujet spécifique",
      "ageRange": "${ageRange}"
    }
  ]
}`;
  }

  /**
   * Construit le prompt de validation de réponse
   */
  private buildValidationPrompt(
    question: string,
    correctAnswer: string,
    childAnswer: string,
    childAge: number,
    exerciseType: string
  ): string {
    const leniencyLevel = childAge <= 8 
      ? 'très tolérant (accepte les fautes d\'orthographe, les formulations approximatives)'
      : childAge <= 11
      ? 'modérément tolérant (accepte les synonymes, les petites erreurs)'
      : 'tolérant mais précis (accepte les synonymes, mais demande une orthographe correcte)';

    return `Évalue la réponse d'un enfant de ${childAge} ans.

Question: ${question}
Réponse attendue: ${correctAnswer}
Réponse de l'enfant: ${childAnswer}
Type d'exercice: ${exerciseType}

Niveau de tolérance: ${leniencyLevel}

Détermine si la réponse est correcte en tenant compte de l'âge de l'enfant. Pour les mathématiques, accepte différents formats (ex: "10", "dix", "10.0"). Pour le français, sois indulgent avec l'orthographe selon l'âge.

Réponds au format JSON suivant:
{
  "isCorrect": true ou false,
  "feedback": "Un message encourageant en français (max 100 caractères)",
  "leniencyApplied": true si tu as appliqué de la tolérance,
  "reasoning": "Courte explication de ta décision"
}`;
  }

  /**
   * Parse la réponse de génération d'exercices
   */
  private parseExercisesResponse(response: DeepSeekChatResponse): GeneratedExercise[] {
    try {
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from DeepSeek');
      }

      const parsed = JSON.parse(content);
      
      if (!parsed.exercises || !Array.isArray(parsed.exercises)) {
        throw new Error('Invalid exercises format');
      }

      return parsed.exercises.map((ex: any) => ({
        question: ex.question || '',
        correctAnswer: ex.correctAnswer || '',
        hints: Array.isArray(ex.hints) ? ex.hints : [],
        topic: ex.topic || '',
        ageRange: ex.ageRange || '',
      }));
    } catch (error) {
      console.error('[DeepSeek] Failed to parse exercises response:', error);
      throw new DeepSeekError('Failed to parse AI response');
    }
  }

  /**
   * Parse la réponse de validation
   */
  private parseValidationResponse(response: DeepSeekChatResponse): AnswerValidationResult {
    try {
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from DeepSeek');
      }

      const parsed = JSON.parse(content);
      
      return {
        isCorrect: parsed.isCorrect === true,
        feedback: parsed.feedback || 'Bien essayé!',
        leniencyApplied: parsed.leniencyApplied === true,
        reasoning: parsed.reasoning,
      };
    } catch (error) {
      console.error('[DeepSeek] Failed to parse validation response:', error);
      throw new DeepSeekError('Failed to parse AI response');
    }
  }

  /**
   * Calcule le coût d'un appel API
   */
  calculateCost(promptTokens: number, completionTokens: number): CostCalculation {
    const promptCost = promptTokens * PRICING.promptTokenPrice;
    const completionCost = completionTokens * PRICING.completionTokenPrice;
    
    return {
      promptTokens,
      completionTokens,
      totalCost: promptCost + completionCost,
      pricePerPromptToken: PRICING.promptTokenPrice,
      pricePerCompletionToken: PRICING.completionTokenPrice,
    };
  }

  /**
   * Crée une métrique pour un appel réussi
   */
  private createMetrics(
    requestId: string,
    operation: 'generate' | 'validate',
    response: DeepSeekChatResponse,
    responseTimeMs: number,
    success: boolean
  ): DeepSeekMetrics {
    const usage = response.usage;
    const cost = this.calculateCost(usage.prompt_tokens, usage.completion_tokens);

    return {
      requestId,
      timestamp: new Date(),
      operation,
      model: response.model,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      responseTimeMs,
      cost: cost.totalCost,
      success,
    };
  }

  /**
   * Crée une métrique pour un appel échoué
   */
  private createFailureMetrics(
    requestId: string,
    operation: 'generate' | 'validate',
    responseTimeMs: number,
    error: Error
  ): DeepSeekMetrics {
    return {
      requestId,
      timestamp: new Date(),
      operation,
      model: this.config.model,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      responseTimeMs,
      cost: 0,
      success: false,
      errorType: error.name,
    };
  }

  /**
   * Récupère les métriques enregistrées
   */
  getMetrics(): DeepSeekMetrics[] {
    return [...this.metrics];
  }

  /**
   * Récupère les statistiques agrégées
   */
  getStats() {
    const totalRequests = this.metrics.length;
    const successfulRequests = this.metrics.filter(m => m.success).length;
    const failedRequests = totalRequests - successfulRequests;
    
    const totalCost = this.metrics.reduce((sum, m) => sum + m.cost, 0);
    const totalTokens = this.metrics.reduce((sum, m) => sum + m.totalTokens, 0);
    const avgResponseTime = totalRequests > 0
      ? this.metrics.reduce((sum, m) => sum + m.responseTimeMs, 0) / totalRequests
      : 0;

    const errorTypes = this.metrics
      .filter(m => !m.success && m.errorType)
      .reduce((acc, m) => {
        acc[m.errorType!] = (acc[m.errorType!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
      totalCost,
      totalTokens,
      avgResponseTime,
      errorTypes,
    };
  }

  /**
   * Réinitialise les métriques
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Utilitaire: sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Instance singleton (optionnel)
 */
let deepSeekInstance: DeepSeekService | null = null;

export function getDeepSeekService(apiKey?: string): DeepSeekService {
  if (!deepSeekInstance) {
    const key = apiKey || process.env.DEEPSEEK_API_KEY;
    if (!key) {
      throw new Error('DEEPSEEK_API_KEY not configured');
    }
    deepSeekInstance = new DeepSeekService(key);
  }
  return deepSeekInstance;
}

export function resetDeepSeekService(): void {
  deepSeekInstance = null;
}
