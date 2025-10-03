/**
 * Utility functions for KidGuard
 */

/**
 * Format time in minutes to human-readable string
 */
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
}

/**
 * Get age range string from age
 */
export function getAgeRange(age: number): string {
  if (age >= 6 && age <= 8) return '6-8';
  if (age >= 9 && age <= 11) return '9-11';
  if (age >= 12 && age <= 14) return '12-14';
  return '6-14';
}

/**
 * Get default difficulty level based on age
 */
export function getDefaultDifficulty(age: number): 'easy' | 'medium' | 'hard' {
  if (age >= 6 && age <= 8) return 'easy';
  if (age >= 9 && age <= 11) return 'medium';
  return 'hard';
}

/**
 * Simple error response helper
 */
export function createErrorResponse(code: string, message: string, status: number): Response {
  return new Response(
    JSON.stringify({
      error: {
        code,
        message,
        timestamp: new Date().toISOString(),
      },
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
