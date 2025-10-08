/**
 * DeepSeek AI Service
 * Handles exercise generation and answer validation using DeepSeek API
 */

export interface DeepSeekResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GeneratedExercise {
  question: string;
  correctAnswer: string;
  hints: string[];
  topic?: string;
}

export class DeepSeekService {
  private apiKey: string;
  private baseUrl = 'https://api.deepseek.com/v1';
  private maxRetries = 3;
  private retryDelay = 1000; // 1 seconde

  constructor() {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY environment variable is not set');
    }
    this.apiKey = apiKey;
  }

  /**
   * Génère des exercices via DeepSeek API
   */
  async generateExercises(
    prompt: string,
    count: number = 1
  ): Promise<GeneratedExercise[]> {
    const startTime = Date.now();

    try {
      const response = await this.callApi(prompt);
      const exercises = this.parseExerciseResponse(response, count);

      const duration = Date.now() - startTime;
      console.log(
        `[DeepSeek] Generated ${exercises.length} exercises in ${duration}ms`
      );

      return exercises;
    } catch (error) {
      console.error('[DeepSeek] Exercise generation failed:', error);
      throw error;
    }
  }

  /**
   * Valide une réponse d'enfant via DeepSeek API
   */
  async validateAnswer(
    question: string,
    correctAnswer: string,
    childAnswer: string,
    age: number
  ): Promise<{
    isCorrect: boolean;
    feedback: string;
    leniencyApplied: boolean;
  }> {
    const startTime = Date.now();

    const validationPrompt = this.buildValidationPrompt(
      question,
      correctAnswer,
      childAnswer,
      age
    );

    try {
      const response = await this.callApi(validationPrompt);
      const result = this.parseValidationResponse(response);

      const duration = Date.now() - startTime;
      console.log(`[DeepSeek] Answer validated in ${duration}ms`);

      return result;
    } catch (error) {
      console.error('[DeepSeek] Answer validation failed:', error);
      // Fallback: exact string match
      const isCorrect =
        childAnswer.trim().toLowerCase() ===
        correctAnswer.trim().toLowerCase();
      return {
        isCorrect,
        feedback: isCorrect ? 'Bonne réponse !' : 'Réponse incorrecte.',
        leniencyApplied: false,
      };
    }
  }

  /**
   * Appelle l'API DeepSeek avec retry logic
   */
  private async callApi(
    prompt: string,
    retryCount: number = 0
  ): Promise<DeepSeekResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `DeepSeek API error (${response.status}): ${error}`
        );
      }

      return await response.json();
    } catch (error) {
      if (retryCount < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, retryCount);
        console.log(
          `[DeepSeek] Retry ${retryCount + 1}/${this.maxRetries} after ${delay}ms`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.callApi(prompt, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Parse la réponse de génération d'exercices
   */
  private parseExerciseResponse(
    response: DeepSeekResponse,
    count: number
  ): GeneratedExercise[] {
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from DeepSeek API');
    }

    try {
      // Tenter de parser le JSON directement
      const parsed = JSON.parse(content);

      // Si c'est un tableau, le retourner
      if (Array.isArray(parsed)) {
        return parsed.slice(0, count);
      }

      // Si c'est un objet unique, le mettre dans un tableau
      return [parsed];
    } catch (error) {
      console.error('[DeepSeek] Failed to parse JSON response:', content);
      throw new Error('Invalid JSON response from DeepSeek API');
    }
  }

  /**
   * Parse la réponse de validation
   */
  private parseValidationResponse(response: DeepSeekResponse): {
    isCorrect: boolean;
    feedback: string;
    leniencyApplied: boolean;
  } {
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty validation response from DeepSeek API');
    }

    try {
      const parsed = JSON.parse(content);
      return {
        isCorrect: parsed.isCorrect === true,
        feedback: parsed.feedback || 'Réponse évaluée.',
        leniencyApplied: parsed.leniencyApplied === true,
      };
    } catch (error) {
      console.error(
        '[DeepSeek] Failed to parse validation response:',
        content
      );
      throw new Error('Invalid validation response from DeepSeek API');
    }
  }

  /**
   * Construit le prompt de validation
   */
  private buildValidationPrompt(
    question: string,
    correctAnswer: string,
    childAnswer: string,
    age: number
  ): string {
    let leniencyLevel = 'modérée';
    if (age <= 8) {
      leniencyLevel = 'très indulgente';
    } else if (age >= 12) {
      leniencyLevel = 'standard';
    }

    return `Tu es un assistant éducatif qui évalue les réponses d'enfants. Évalue cette réponse avec une tolérance ${leniencyLevel} (âge: ${age} ans).

Question: ${question}
Réponse attendue: ${correctAnswer}
Réponse de l'enfant: ${childAnswer}

Instructions:
- Pour les enfants de 6-8 ans: accepte les erreurs d'orthographe, les synonymes, les réponses partielles correctes
- Pour les enfants de 9-11 ans: accepte les synonymes et petites erreurs d'orthographe
- Pour les enfants de 12-14 ans: accepte les synonymes mais privilégie l'orthographe correcte
- Pour les maths: accepte différents formats (10, "dix", "10.0")
- Sois encourageant et positif dans tes feedbacks

Réponds UNIQUEMENT avec un objet JSON dans ce format:
{
  "isCorrect": true/false,
  "feedback": "Message encourageant en français",
  "leniencyApplied": true/false
}`;
  }
}
