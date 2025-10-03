// Shared utility functions for KidGuard

/**
 * Format time in minutes to a human-readable string
 * @param minutes - Time in minutes
 * @returns Formatted string (e.g., "15 minutes", "1h30")
 */
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h${mins.toString().padStart(2, '0')}`;
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a random ID
 * @returns Random alphanumeric ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
