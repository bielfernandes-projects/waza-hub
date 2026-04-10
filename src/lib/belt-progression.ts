/**
 * Belt progression time mapping.
 * Maps each belt transition to the estimated months required.
 */

export const BELT_PROGRESSION_MONTHS: Record<string, number> = {
  "branca-cinza": 3,
  "cinza": 3,
  "cinza-azul": 6,
  "azul": 6,
  "azul-amarela": 6,
  "amarela": 6,
  "amarela-laranja": 12,
  "laranja": 12,
  "verde": 12,
  "roxa": 12,
  "marrom": 12,
  "preta": 12,
};

/**
 * Calculate estimated months remaining until black belt (preta).
 * Sums months for each belt AFTER the current belt index.
 */
export function calculateMonthsToBlackBelt(currentBeltId: string, allBeltIds: string[]): number {
  const currentIndex = allBeltIds.indexOf(currentBeltId);
  if (currentIndex === -1) return 0;

  let totalMonths = 0;
  for (let i = currentIndex + 1; i < allBeltIds.length; i++) {
    totalMonths += BELT_PROGRESSION_MONTHS[allBeltIds[i]] ?? 6;
  }
  return totalMonths;
}
