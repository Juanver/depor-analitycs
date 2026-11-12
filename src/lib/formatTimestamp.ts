/**
 * Formats seconds into MM:SS format (e.g., 258 -> "04:18")
 */
export function formatSecondsToMMSS(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats seconds into a bracketed timestamp (e.g., 258 -> "[04:18]")
 */
export function formatBracketTimestamp(seconds: number): string {
  return `[${formatSecondsToMMSS(seconds)}]`;
}

/**
 * Parses a string timestamp like "04:18", "[04:18]", "1:25:30" into total seconds
 */
export function parseTimestampToSeconds(timestamp: string): number {
  const clean = timestamp.replace(/[\[\]\s]/g, '');
  const parts = clean.split(':').map(Number);

  if (parts.some(isNaN)) return 0;

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  return 0;
}

/**
 * Extracts YouTube video ID from standard or shortened URLs
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}
