/**
 * YouTube video downloader implementation
 */
import ytdl from 'ytdl-core';
import * as fs from 'fs';
import * as path from 'path';
import { 
  Downloader, 
  VideoInfo, 
  DownloadOptions, 
  DownloadResult, 
  Platform, 
  Quality, 
  Format 
} from '../types';
import { isYouTubeURL, extractYouTubeVideoId } from '../utils/validation';
import { generateFilename, saveBufferToFile, ensureDirectoryExists } from '../utils/format';

/**
 * YouTube video downloader class
 */
export class YouTubeDownloader implements Downloader {
  /**
   * Validates if a URL is supported by this downloader
   * @param url URL to validate
   * @returns boolean indicating if the URL is supported
   */
  public validateURL(url: string): boolean {
    return isYouTubeURL(url);
  }

  /**
   * Get information about a YouTube video
   * @param url YouTube video URL
   * @returns Promise with video information
   */
  public async getInfo(url: string): Promise<VideoInfo> {
    if (!this.validateURL(url)) {
      throw new Error('Invalid YouTube URL');
    }

    try {
      const info = await ytdl.getInfo(url);
      
      return {
        title: info.videoDetails.title,
        description: info.videoDetails.description,
        duration: parseInt(info.videoDetails.lengthSeconds),
        thumbnail: info.videoDetails.thumbnails[0]?.url,
        author: info.videoDetails.author.name,
        url: url,
        platform: Platform.YOUTUBE,
        uploadDate: info.videoDetails.uploadDate,
        views: parseInt(info.videoDetails.viewCount),
      };
    } catch (error) {
      throw new Error(`Failed to get video info: ${error.message}`);
    }
  }

  /**
   * Maps Quality enum to ytdl-core quality
   * @param quality Quality enum value
   * @returns ytdl-core quality string
   */
  private mapQuality(quality: Quality): string {
    switch (quality) {
      case Quality.HIGHEST:
        return 'highestvideo';
      case Quality.LOWEST:
        return 'lowestvideo';
      case Quality.AUDIO_ONLY:
        return 'highestaudio';
      case Quality.HD:
        return 'highestvideo';
      case Quality.SD:
        return '480p';
      default:
        return 'highest';
    }
  }

  /**
   * Download a YouTube video
   * @param url YouTube video URL
   * @param options Download options
   * @returns Promise with download result
   */
  public async download(
    url: string,
    options: DownloadOptions = {}
  ): Promise<DownloadResult> {
    if (!this.validateURL(url)) {
      return {
        success: false,
        message: 'Invalid YouTube URL',
        error: new Error('Invalid YouTube URL'),
      };
    }

    try {
      const videoInfo = await this.getInfo(url);
      
      const {
        quality = Quality.HIGHEST,
        format = Format.MP4,
        outputPath = './downloads',
        fileName = generateFilename(videoInfo.title, format),
        includeAudio = true,
        includeVideo = true,
      } = options;

      ensureDirectoryExists(outputPath);
      const filePath = path.join(outputPath, fileName);
      
      // Configure ytdl options
      const ytdlOptions: ytdl.downloadOptions = {
        quality: this.mapQuality(quality),
      };
      
      if (format === Format.MP3 || quality === Quality.AUDIO_ONLY) {
        ytdlOptions.filter = 'audioonly';
      } else if (!includeAudio) {
        ytdlOptions.filter = 'videoonly';
      } else if (!includeVideo) {
        ytdlOptions.filter = 'audioonly';
      }

      // Create write stream
      const writeStream = fs.createWriteStream(filePath);
      
      // Download the video
      return new Promise((resolve, reject) => {
        const stream = ytdl(url, ytdlOptions);
        
        stream.pipe(writeStream);
        
        stream.on('end', () => {
          resolve({
            success: true,
            message: 'Download completed successfully',
            filePath,
            videoInfo,
          });
        });
        
        stream.on('error', (error) => {
          reject({
            success: false,
            message: `Download failed: ${error.message}`,
            error,
          });
        });
      });
    } catch (error) {
      return {
        success: false,
        message: `Download failed: ${error.message}`,
        error,
      };
    }
  }
}
