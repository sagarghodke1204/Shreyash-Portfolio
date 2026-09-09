/**
 * Helper to identify Google Drive sharing links and format them into embeddable preview URLs.
 * Example input:  https://drive.google.com/file/d/1A2B3C4D5E/view?usp=sharing
 * Example output: https://drive.google.com/file/d/1A2B3C4D5E/preview
 */
export function getGoogleDriveEmbedUrl(url: string): string {
  if (!url) return '';

  const trimmed = url.trim();

  // Return original URL if it does not point to Google Drive
  if (!trimmed.includes('drive.google.com') && !trimmed.includes('docs.google.com')) {
    return trimmed;
  }

  // Regular expression patterns to extract the unique file ID
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/open\?id=([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
  }

  return trimmed;
}

/**
 * Checks whether a given string is a Google Drive domain link
 */
export function isGoogleDriveUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com');
}
