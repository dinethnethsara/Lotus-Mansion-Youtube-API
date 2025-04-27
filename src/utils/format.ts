/**
 * Format utilities for handling different file formats
 */
import { Format, Quality } from '../types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Ensures a directory exists, creating it if necessary
 * @param dirPath Directory path
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Sanitizes a filename to remove invalid characters
 * @param filename Filename to sanitize
 * @returns Sanitized filename
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[/\\?%*:|"<>]/g, '-') // Replace invalid characters with dash
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .trim();
};

/**
 * Generates a filename based on video title and format
 * @param title Video title
 * @param format Output format
 * @returns Generated filename
 */
export const generateFilename = (title: string, format: Format): string => {
  const sanitized = sanitizeFilename(title);
  return `${sanitized}.${format.toLowerCase()}`;
};

/**
 * Saves a buffer to a file
 * @param buffer Data buffer
 * @param outputPath Output directory path
 * @param filename Output filename
 * @returns Full path to the saved file
 */
export const saveBufferToFile = (
  buffer: Buffer,
  outputPath: string,
  filename: string
): string => {
  ensureDirectoryExists(outputPath);
  const filePath = path.join(outputPath, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

/**
 * Converts a quality string to a standardized Quality enum
 * @param quality Quality string
 * @returns Standardized Quality enum value
 */
export const normalizeQuality = (quality: string): Quality => {
  const qualityLower = quality.toLowerCase();
  
  if (qualityLower.includes('high') || qualityLower.includes('hd') || qualityLower === '1080p' || qualityLower === '720p') {
    return Quality.HIGHEST;
  }
  
  if (qualityLower.includes('low') || qualityLower.includes('sd') || qualityLower === '480p' || qualityLower === '360p') {
    return Quality.LOWEST;
  }
  
  if (qualityLower.includes('audio')) {
    return Quality.AUDIO_ONLY;
  }
  
  return Quality.HIGHEST; // Default to highest
};

/**
 * Gets the file extension for a given format
 * @param format Format enum value
 * @returns File extension
 */
export const getFileExtension = (format: Format): string => {
  return format.toLowerCase();
};
