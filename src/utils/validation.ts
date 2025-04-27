/**
 * URL validation utilities
 */

/**
 * YouTube URL patterns
 */
const YOUTUBE_PATTERNS = [
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
  /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})$/,
  /^(https?:\/\/)?(www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})$/,
  /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})$/,
];

/**
 * TikTok URL patterns
 */
const TIKTOK_PATTERNS = [
  /^(https?:\/\/)?(www\.)?(tiktok\.com)\/.+$/,
  /^(https?:\/\/)?(www\.)?vm\.tiktok\.com\/[a-zA-Z0-9]+\/?$/,
  /^(https?:\/\/)?(www\.)?tiktok\.com\/@[a-zA-Z0-9_.]+\/video\/\d+\/?$/,
];

/**
 * Instagram URL patterns
 */
const INSTAGRAM_PATTERNS = [
  /^(https?:\/\/)?(www\.)?(instagram\.com)\/.+$/,
  /^(https?:\/\/)?(www\.)?instagram\.com\/p\/[a-zA-Z0-9_-]+\/?$/,
  /^(https?:\/\/)?(www\.)?instagram\.com\/reel\/[a-zA-Z0-9_-]+\/?$/,
];

/**
 * Twitter/X URL patterns
 */
const TWITTER_PATTERNS = [
  /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+$/,
  /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/\d+\/?$/,
];

/**
 * Facebook URL patterns
 */
const FACEBOOK_PATTERNS = [
  /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/,
  /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/videos\/\d+\/?$/,
  /^(https?:\/\/)?(www\.)?fb\.watch\/[a-zA-Z0-9_-]+\/?$/,
];

/**
 * Validates if a URL is a YouTube URL
 * @param url URL to validate
 * @returns boolean indicating if the URL is a valid YouTube URL
 */
export const isYouTubeURL = (url: string): boolean => {
  return YOUTUBE_PATTERNS.some(pattern => pattern.test(url));
};

/**
 * Validates if a URL is a TikTok URL
 * @param url URL to validate
 * @returns boolean indicating if the URL is a valid TikTok URL
 */
export const isTikTokURL = (url: string): boolean => {
  return TIKTOK_PATTERNS.some(pattern => pattern.test(url));
};

/**
 * Validates if a URL is an Instagram URL
 * @param url URL to validate
 * @returns boolean indicating if the URL is a valid Instagram URL
 */
export const isInstagramURL = (url: string): boolean => {
  return INSTAGRAM_PATTERNS.some(pattern => pattern.test(url));
};

/**
 * Validates if a URL is a Twitter/X URL
 * @param url URL to validate
 * @returns boolean indicating if the URL is a valid Twitter/X URL
 */
export const isTwitterURL = (url: string): boolean => {
  return TWITTER_PATTERNS.some(pattern => pattern.test(url));
};

/**
 * Validates if a URL is a Facebook URL
 * @param url URL to validate
 * @returns boolean indicating if the URL is a valid Facebook URL
 */
export const isFacebookURL = (url: string): boolean => {
  return FACEBOOK_PATTERNS.some(pattern => pattern.test(url));
};

/**
 * Extracts YouTube video ID from a URL
 * @param url YouTube URL
 * @returns YouTube video ID or null if not found
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!isYouTubeURL(url)) return null;
  
  // Handle youtu.be URLs
  if (url.includes('youtu.be')) {
    const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }
  
  // Handle youtube.com/shorts URLs
  if (url.includes('youtube.com/shorts')) {
    const match = url.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }
  
  // Handle standard youtube.com URLs
  const urlObj = new URL(url);
  if (urlObj.searchParams.has('v')) {
    return urlObj.searchParams.get('v');
  }
  
  return null;
};

/**
 * Validates if a URL is supported by any platform
 * @param url URL to validate
 * @returns boolean indicating if the URL is supported
 */
export const isSupportedURL = (url: string): boolean => {
  return (
    isYouTubeURL(url) ||
    isTikTokURL(url) ||
    isInstagramURL(url) ||
    isTwitterURL(url) ||
    isFacebookURL(url)
  );
};
