/**
 * Lotus Mansion Video Downloader API
 * The ultimate comprehensive video downloader API library for multiple platforms
 *
 * Created by Lotus Mansion Team, Hexa Nirnamika, and Sentino
 *
 * Features:
 * - Download videos from multiple platforms (YouTube, TikTok, Instagram, Twitter, Facebook, etc.)
 * - Download videos without watermarks
 * - Multiple quality options (4K, 1080p, 720p, etc.)
 * - Multiple format options (MP4, MP3, WEBM, MKV, AVI, etc.)
 * - Extract comprehensive video information and metadata
 * - Batch downloading (multiple videos, playlists, channels)
 * - Download progress tracking with events
 * - Video processing (trimming, merging, compression, etc.)
 * - Live stream recording
 * - Scheduled downloads
 * - And much more!
 */

// Export types
export * from './types';

// Export utilities
export * from './utils/validation';
export * from './utils/http';
export * from './utils/format';

// Export platform-specific downloaders
export { YouTubeDownloader } from './platforms/youtube';
export { TikTokDownloader } from './platforms/tiktok';
export { InstagramDownloader } from './platforms/instagram';
export { TwitterDownloader } from './platforms/twitter';
export { FacebookDownloader } from './platforms/facebook';

// Import platform-specific downloaders
import { YouTubeDownloader } from './platforms/youtube';
import { TikTokDownloader } from './platforms/tiktok';
import { InstagramDownloader } from './platforms/instagram';
import { TwitterDownloader } from './platforms/twitter';
import { FacebookDownloader } from './platforms/facebook';

// Import types
import {
  Downloader,
  VideoInfo,
  DownloadOptions,
  DownloadResult,
  Platform,
  BatchDownloadOptions,
  PlaylistInfo,
  ChannelInfo,
  AuthConfig,
  VideoProcessingOptions,
  VideoProcessingResult,
  LiveStreamRecordingOptions,
  LiveStreamRecordingControl,
  ScheduledDownloadOptions,
  ScheduledDownloadControl
} from './types';

// Import validation utilities
import {
  isYouTubeURL,
  isTikTokURL,
  isInstagramURL,
  isTwitterURL,
  isFacebookURL,
  isSupportedURL
} from './utils/validation';

/**
 * Main video downloader class
 */
export class VideoDownloader {
  private downloaders: Map<Platform, Downloader>;

  /**
   * Constructor
   */
  constructor() {
    this.downloaders = new Map();

    // Initialize platform-specific downloaders
    this.downloaders.set(Platform.YOUTUBE, new YouTubeDownloader());
    this.downloaders.set(Platform.TIKTOK, new TikTokDownloader());
    this.downloaders.set(Platform.INSTAGRAM, new InstagramDownloader());
    this.downloaders.set(Platform.TWITTER, new TwitterDownloader());
    this.downloaders.set(Platform.FACEBOOK, new FacebookDownloader());
  }

  /**
   * Get the appropriate downloader for a URL
   * @param url URL to get downloader for
   * @returns Downloader instance or null if not supported
   */
  private getDownloaderForUrl(url: string): Downloader | null {
    if (isYouTubeURL(url)) {
      return this.downloaders.get(Platform.YOUTUBE);
    } else if (isTikTokURL(url)) {
      return this.downloaders.get(Platform.TIKTOK);
    } else if (isInstagramURL(url)) {
      return this.downloaders.get(Platform.INSTAGRAM);
    } else if (isTwitterURL(url)) {
      return this.downloaders.get(Platform.TWITTER);
    } else if (isFacebookURL(url)) {
      return this.downloaders.get(Platform.FACEBOOK);
    }

    return null;
  }

  /**
   * Check if a URL is supported
   * @param url URL to check
   * @returns boolean indicating if the URL is supported
   */
  public isSupported(url: string): boolean {
    return isSupportedURL(url);
  }

  /**
   * Get information about a video
   * @param url Video URL
   * @returns Promise with video information
   */
  public async getInfo(url: string): Promise<VideoInfo> {
    const downloader = this.getDownloaderForUrl(url);

    if (!downloader) {
      throw new Error('Unsupported URL');
    }

    return downloader.getInfo(url);
  }

  /**
   * Download a video
   * @param url Video URL
   * @param options Download options
   * @returns Promise with download result
   */
  public async download(
    url: string,
    options: DownloadOptions = {}
  ): Promise<DownloadResult> {
    const downloader = this.getDownloaderForUrl(url);

    if (!downloader) {
      return {
        success: false,
        message: 'Unsupported URL',
        error: new Error('Unsupported URL'),
      };
    }

    return downloader.download(url, options);
  }

  /**
   * Batch download multiple videos
   * @param urls Array of video URLs
   * @param options Download options
   * @returns Promise with array of download results
   */
  public async batchDownload(
    urls: string[],
    options: BatchDownloadOptions = {}
  ): Promise<DownloadResult[]> {
    const { concurrency = 3, onProgress, ...downloadOptions } = options;

    // Filter out unsupported URLs
    const supportedUrls = urls.filter(url => this.isSupported(url));

    if (supportedUrls.length === 0) {
      return [];
    }

    const results: DownloadResult[] = [];
    let completed = 0;

    // Process URLs in batches based on concurrency
    for (let i = 0; i < supportedUrls.length; i += concurrency) {
      const batch = supportedUrls.slice(i, i + concurrency);

      // Download batch in parallel
      const batchResults = await Promise.all(
        batch.map(async (url) => {
          try {
            const result = await this.download(url, downloadOptions);
            completed++;

            // Report progress if callback provided
            if (onProgress) {
              onProgress({
                percentage: Math.round((completed / supportedUrls.length) * 100),
                completed,
                total: supportedUrls.length,
                current: {
                  url,
                  progress: {
                    percentage: 100,
                    downloaded: result.size || 0,
                    total: result.size || 0,
                    speed: 0,
                    eta: 0,
                    timeElapsed: result.duration || 0
                  }
                }
              });
            }

            return result;
          } catch (error) {
            completed++;

            // Report progress even on error
            if (onProgress) {
              onProgress({
                percentage: Math.round((completed / supportedUrls.length) * 100),
                completed,
                total: supportedUrls.length
              });
            }

            return {
              success: false,
              message: `Download failed: ${error.message}`,
              error,
              url
            };
          }
        })
      );

      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Get information about a playlist
   * @param url Playlist URL
   * @returns Promise with playlist information
   */
  public async getPlaylistInfo(url: string): Promise<PlaylistInfo> {
    const downloader = this.getDownloaderForUrl(url);

    if (!downloader || !downloader.getPlaylistInfo) {
      throw new Error('Playlist not supported for this URL');
    }

    return downloader.getPlaylistInfo(url);
  }

  /**
   * Download all videos in a playlist
   * @param url Playlist URL
   * @param options Download options
   * @returns Promise with array of download results
   */
  public async downloadPlaylist(
    url: string,
    options: BatchDownloadOptions = {}
  ): Promise<DownloadResult[]> {
    const downloader = this.getDownloaderForUrl(url);

    if (!downloader || !downloader.downloadPlaylist) {
      return [{
        success: false,
        message: 'Playlist download not supported for this URL',
        error: new Error('Playlist download not supported for this URL')
      }];
    }

    return downloader.downloadPlaylist(url, options);
  }

  /**
   * Get information about a channel
   * @param url Channel URL
   * @returns Promise with channel information
   */
  public async getChannelInfo(url: string): Promise<ChannelInfo> {
    const downloader = this.getDownloaderForUrl(url);

    if (!downloader || !downloader.getChannelInfo) {
      throw new Error('Channel not supported for this URL');
    }

    return downloader.getChannelInfo(url);
  }

  /**
   * Download all videos from a channel
   * @param url Channel URL
   * @param options Download options
   * @returns Promise with array of download results
   */
  public async downloadChannel(
    url: string,
    options: BatchDownloadOptions = {}
  ): Promise<DownloadResult[]> {
    const downloader = this.getDownloaderForUrl(url);

    if (!downloader || !downloader.downloadChannel) {
      return [{
        success: false,
        message: 'Channel download not supported for this URL',
        error: new Error('Channel download not supported for this URL')
      }];
    }

    return downloader.downloadChannel(url, options);
  }

  /**
   * Set authentication for a specific platform
   * @param platform Platform to set authentication for
   * @param auth Authentication configuration
   */
  public setAuthentication(platform: Platform, auth: AuthConfig): void {
    const downloader = this.downloaders.get(platform);

    if (!downloader || !downloader.setAuthentication) {
      throw new Error(`Authentication not supported for ${platform}`);
    }

    downloader.setAuthentication(auth);
  }

  /**
   * Process a video with various operations
   * @param options Video processing options
   * @returns Promise with processing result
   */
  public async processVideo(options: VideoProcessingOptions): Promise<VideoProcessingResult> {
    // This is a placeholder implementation
    // In a real implementation, you would use ffmpeg or another video processing library
    return {
      success: false,
      message: 'Video processing not implemented yet',
      outputPath: options.outputPath,
      error: new Error('Not implemented')
    };
  }

  /**
   * Record a live stream
   * @param url Live stream URL
   * @param options Recording options
   * @returns Promise with recording control
   */
  public async recordLiveStream(
    url: string,
    options: LiveStreamRecordingOptions
  ): Promise<LiveStreamRecordingControl> {
    const downloader = this.getDownloaderForUrl(url);

    if (!downloader || !downloader.recordLiveStream) {
      throw new Error('Live stream recording not supported for this URL');
    }

    return downloader.recordLiveStream(url, options);
  }

  /**
   * Schedule a download for later
   * @param options Scheduled download options
   * @returns Scheduled download control
   */
  public scheduleDownload(options: ScheduledDownloadOptions): ScheduledDownloadControl {
    const { url, schedule, onComplete, onError } = options;

    // Generate a unique ID for this scheduled download
    const id = `scheduled-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Calculate the initial delay
    const now = new Date();
    const initialDelay = schedule.date.getTime() - now.getTime();

    if (initialDelay < 0 && schedule.repeat === 'once') {
      throw new Error('Scheduled date is in the past');
    }

    let timeoutId: NodeJS.Timeout;
    let isPaused = false;
    let nextRun = new Date(schedule.date);

    // Function to execute the download
    const executeDownload = async () => {
      if (isPaused) return;

      try {
        const result = await this.download(url, options.options);

        if (onComplete) {
          onComplete(result);
        }

        // Schedule next run if this is a repeating schedule
        if (schedule.repeat && schedule.repeat !== 'once') {
          scheduleNextRun();
        }
      } catch (error) {
        if (onError) {
          onError(error);
        }

        // Even on error, schedule next run if this is a repeating schedule
        if (schedule.repeat && schedule.repeat !== 'once') {
          scheduleNextRun();
        }
      }
    };

    // Function to schedule the next run based on repeat type
    const scheduleNextRun = () => {
      if (isPaused) return;

      const now = new Date();
      let nextDate = new Date(nextRun);

      switch (schedule.repeat) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1);
          break;

        case 'weekly':
          if (schedule.days && schedule.days.length > 0) {
            // Find the next day in the schedule
            const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const currentDayIndex = now.getDay();

            // Convert schedule.days to day indices
            const scheduledDayIndices = schedule.days.map(day => daysOfWeek.indexOf(day));

            // Find the next scheduled day
            let daysToAdd = 1;
            let nextDayIndex = (currentDayIndex + daysToAdd) % 7;

            while (!scheduledDayIndices.includes(nextDayIndex)) {
              daysToAdd++;
              nextDayIndex = (currentDayIndex + daysToAdd) % 7;

              // Prevent infinite loop
              if (daysToAdd > 7) {
                break;
              }
            }

            nextDate.setDate(nextDate.getDate() + daysToAdd);
          } else {
            // Default to 7 days if no specific days provided
            nextDate.setDate(nextDate.getDate() + 7);
          }
          break;

        case 'monthly':
          if (schedule.dayOfMonth && schedule.dayOfMonth >= 1 && schedule.dayOfMonth <= 31) {
            // Set to the specified day of the next month
            nextDate.setMonth(nextDate.getMonth() + 1);
            nextDate.setDate(schedule.dayOfMonth);
          } else {
            // Default to same day next month
            nextDate.setMonth(nextDate.getMonth() + 1);
          }
          break;

        default:
          // No repeat or unknown repeat type
          return;
      }

      // Check if we've passed the end date
      if (schedule.endDate && nextDate > schedule.endDate) {
        return;
      }

      // Update next run time
      nextRun = nextDate;

      // Schedule the next run
      const delay = nextDate.getTime() - now.getTime();
      timeoutId = setTimeout(executeDownload, delay);
    };

    // Schedule the initial run
    timeoutId = setTimeout(executeDownload, Math.max(0, initialDelay));

    // Return control interface
    return {
      id,
      cancel: () => {
        clearTimeout(timeoutId);
      },
      pause: () => {
        isPaused = true;
      },
      resume: () => {
        isPaused = false;

        // If we're resuming, check if we need to reschedule
        const now = new Date();
        if (nextRun < now) {
          // We missed the scheduled time, run immediately
          executeDownload();
        } else {
          // Schedule for the next run time
          const delay = nextRun.getTime() - now.getTime();
          timeoutId = setTimeout(executeDownload, delay);
        }
      },
      getStatus: () => ({
        id,
        url,
        nextRun,
        isPaused
      })
    };
  }
}

// Create default instance
const downloader = new VideoDownloader();

// Export default instance
export default downloader;
