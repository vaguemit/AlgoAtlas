/**
 * Utility functions for working with Codeforces data
 */

/**
 * Returns a color based on a Codeforces rating
 * @param rating The Codeforces rating
 * @returns A hex color string
 */
export function getRatingColor(rating?: number): string {
  if (!rating) return '#FFFFFF';
  
  if (rating < 1200) return '#CCCCCC'; // Newbie: Gray
  if (rating < 1400) return '#77FF77'; // Pupil: Green
  if (rating < 1600) return '#77DDBB'; // Specialist: Cyan
  if (rating < 1900) return '#AAAAFF'; // Expert: Blue
  if (rating < 2100) return '#FF88FF'; // Candidate Master: Purple
  if (rating < 2400) return '#FFCC88'; // Master: Orange
  if (rating < 2600) return '#FF7777'; // International Master: Red
  if (rating < 3000) return '#FF3333'; // Grandmaster: Red
  return '#AA0000'; // Legendary Grandmaster: Dark Red
} 