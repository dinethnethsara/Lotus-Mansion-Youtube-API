#!/usr/bin/env node

/**
 * Lotus Mansion Video Downloader CLI
 * Command-line interface for the video downloader library
 */

import { program } from 'commander';
import downloader, { Quality, Format, Platform } from './index';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Set up the CLI program
program
  .name('lotus-downloader')
  .description('Lotus Mansion Video Downloader CLI')
  .version('1.0.0');

// Download command
program
  .command('download <url>')
  .description('Download a video')
  .option('-q, --quality <quality>', 'Video quality (highest, lowest, audio, hd, sd, 4k, 1080p, 720p, 480p, 360p, 240p, 144p)')
  .option('-f, --format <format>', 'Output format (mp4, mp3, webm, mkv, etc.)')
  .option('-o, --output <path>', 'Output directory', './downloads')
  .option('-n, --filename <name>', 'Custom filename')
  .option('--audio-only', 'Download audio only')
  .option('--no-audio', 'Download without audio')
  .option('--no-video', 'Download without video')
  .option('--subtitles', 'Download subtitles')
  .option('--info-only', 'Show video info without downloading')
  .action(async (url, options) => {
    try {
      if (options.infoOnly) {
        const info = await downloader.getInfo(url);
        console.log(JSON.stringify(info, null, 2));
        return;
      }

      console.log(`Downloading: ${url}`);
      
      const downloadOptions = {
        quality: options.quality as Quality,
        format: options.format as Format,
        outputPath: options.output,
        fileName: options.filename,
        includeAudio: options.audio !== false,
        includeVideo: options.video !== false,
        subtitles: options.subtitles,
        onProgress: (progress) => {
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0);
          process.stdout.write(`Progress: ${progress.percentage}% (${Math.round(progress.downloaded / 1024 / 1024)}MB / ${Math.round(progress.total / 1024 / 1024)}MB)`);
        }
      };

      if (options.audioOnly) {
        downloadOptions.quality = Quality.AUDIO_ONLY;
        downloadOptions.format = Format.MP3;
        downloadOptions.includeVideo = false;
      }

      const result = await downloader.download(url, downloadOptions);
      
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      
      if (result.success) {
        console.log(`Download completed: ${result.filePath}`);
      } else {
        console.error(`Download failed: ${result.message}`);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

// Batch download command
program
  .command('batch <file>')
  .description('Download multiple videos from a file (one URL per line)')
  .option('-q, --quality <quality>', 'Video quality (highest, lowest, audio, hd, sd, 4k, 1080p, 720p, 480p, 360p, 240p, 144p)')
  .option('-f, --format <format>', 'Output format (mp4, mp3, webm, mkv, etc.)')
  .option('-o, --output <path>', 'Output directory', './downloads')
  .option('-c, --concurrency <number>', 'Number of concurrent downloads', '3')
  .action(async (file, options) => {
    try {
      if (!fs.existsSync(file)) {
        console.error(`File not found: ${file}`);
        return;
      }

      const urls = fs.readFileSync(file, 'utf-8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));

      console.log(`Found ${urls.length} URLs in ${file}`);
      
      const results = await downloader.batchDownload(urls, {
        quality: options.quality as Quality,
        format: options.format as Format,
        outputPath: options.output,
        concurrency: parseInt(options.concurrency),
        onProgress: (progress) => {
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0);
          process.stdout.write(`Overall progress: ${progress.percentage}% (${progress.completed}/${progress.total})`);
        }
      });
      
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      
      const successful = results.filter(r => r.success).length;
      console.log(`Completed: ${successful}/${results.length} downloads`);
      
      if (successful < results.length) {
        console.log('Failed downloads:');
        results.filter(r => !r.success).forEach((result, index) => {
          console.log(`  ${index + 1}. ${result.videoInfo?.url || 'Unknown URL'}: ${result.message}`);
        });
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

// Playlist download command
program
  .command('playlist <url>')
  .description('Download all videos in a playlist')
  .option('-q, --quality <quality>', 'Video quality (highest, lowest, audio, hd, sd, 4k, 1080p, 720p, 480p, 360p, 240p, 144p)')
  .option('-f, --format <format>', 'Output format (mp4, mp3, webm, mkv, etc.)')
  .option('-o, --output <path>', 'Output directory', './downloads/playlists')
  .option('-c, --concurrency <number>', 'Number of concurrent downloads', '2')
  .option('--info-only', 'Show playlist info without downloading')
  .action(async (url, options) => {
    try {
      console.log(`Getting playlist info: ${url}`);
      
      const playlist = await downloader.getPlaylistInfo(url);
      console.log(`Playlist: ${playlist.title}`);
      console.log(`Videos: ${playlist.videoCount}`);
      
      if (options.infoOnly) {
        console.log(JSON.stringify(playlist, null, 2));
        return;
      }
      
      const outputPath = path.join(options.output, playlist.title);
      
      console.log(`Downloading ${playlist.videoCount} videos to ${outputPath}`);
      
      const results = await downloader.downloadPlaylist(url, {
        quality: options.quality as Quality,
        format: options.format as Format,
        outputPath,
        concurrency: parseInt(options.concurrency),
        onProgress: (progress) => {
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0);
          process.stdout.write(`Overall progress: ${progress.percentage}% (${progress.completed}/${progress.total})`);
        }
      });
      
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      
      const successful = results.filter(r => r.success).length;
      console.log(`Completed: ${successful}/${results.length} downloads`);
      
      if (successful < results.length) {
        console.log('Failed downloads:');
        results.filter(r => !r.success).forEach((result, index) => {
          console.log(`  ${index + 1}. ${result.videoInfo?.title || 'Unknown video'}: ${result.message}`);
        });
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

// Info command
program
  .command('info <url>')
  .description('Get information about a video, playlist, or channel')
  .option('--raw', 'Output raw JSON')
  .action(async (url, options) => {
    try {
      console.log(`Getting info for: ${url}`);
      
      // Try to get video info first
      try {
        const info = await downloader.getInfo(url);
        
        if (options.raw) {
          console.log(JSON.stringify(info, null, 2));
          return;
        }
        
        console.log('=== Video Information ===');
        console.log(`Title: ${info.title}`);
        console.log(`Author: ${info.author}`);
        console.log(`Platform: ${info.platform}`);
        console.log(`Duration: ${info.duration ? formatDuration(info.duration) : 'Unknown'}`);
        console.log(`Upload Date: ${info.uploadDate || 'Unknown'}`);
        console.log(`Views: ${info.views?.toLocaleString() || 'Unknown'}`);
        
        if (info.isLive) {
          console.log('Status: Live Stream');
        }
        
        if (info.isPrivate) {
          console.log('Status: Private Video');
        }
        
        if (info.isAgeRestricted) {
          console.log('Status: Age Restricted');
        }
        
        return;
      } catch (error) {
        // Not a video, try playlist
      }
      
      // Try to get playlist info
      try {
        const playlist = await downloader.getPlaylistInfo(url);
        
        if (options.raw) {
          console.log(JSON.stringify(playlist, null, 2));
          return;
        }
        
        console.log('=== Playlist Information ===');
        console.log(`Title: ${playlist.title}`);
        console.log(`Author: ${playlist.author}`);
        console.log(`Platform: ${playlist.platform}`);
        console.log(`Video Count: ${playlist.videoCount}`);
        
        console.log('\nVideos:');
        playlist.videos.slice(0, 5).forEach((video, index) => {
          console.log(`  ${index + 1}. ${video.title}`);
        });
        
        if (playlist.videos.length > 5) {
          console.log(`  ... and ${playlist.videos.length - 5} more videos`);
        }
        
        return;
      } catch (error) {
        // Not a playlist, try channel
      }
      
      // Try to get channel info
      try {
        const channel = await downloader.getChannelInfo(url);
        
        if (options.raw) {
          console.log(JSON.stringify(channel, null, 2));
          return;
        }
        
        console.log('=== Channel Information ===');
        console.log(`Name: ${channel.name}`);
        console.log(`Platform: ${channel.platform}`);
        console.log(`Subscribers: ${channel.subscriberCount?.toLocaleString() || 'Unknown'}`);
        console.log(`Video Count: ${channel.videoCount?.toLocaleString() || 'Unknown'}`);
        console.log(`Join Date: ${channel.joinDate || 'Unknown'}`);
        
        if (channel.latestVideos && channel.latestVideos.length > 0) {
          console.log('\nLatest Videos:');
          channel.latestVideos.slice(0, 5).forEach((video, index) => {
            console.log(`  ${index + 1}. ${video.title}`);
          });
        }
        
        return;
      } catch (error) {
        console.error('Could not get information for this URL');
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

// Process video command
program
  .command('process <input>')
  .description('Process a video file')
  .option('-o, --output <path>', 'Output file path')
  .option('--trim <start-end>', 'Trim video (format: HH:MM:SS-HH:MM:SS)')
  .option('--extract-audio', 'Extract audio from video')
  .option('--audio-format <format>', 'Audio format for extraction (mp3, aac, etc.)', 'mp3')
  .option('--compress', 'Compress video')
  .option('--resize <size>', 'Resize video (format: WIDTHxHEIGHT)')
  .option('--rotate <angle>', 'Rotate video (90, 180, 270)')
  .option('--watermark <image>', 'Add watermark image')
  .option('--watermark-position <position>', 'Watermark position (topLeft, topRight, bottomLeft, bottomRight, center)', 'bottomRight')
  .action(async (input, options) => {
    try {
      if (!fs.existsSync(input)) {
        console.error(`Input file not found: ${input}`);
        return;
      }
      
      const operations = [];
      
      // Add trim operation
      if (options.trim) {
        const [start, end] = options.trim.split('-');
        operations.push({
          type: 'trim',
          startTime: start,
          endTime: end
        });
      }
      
      // Add extract audio operation
      if (options.extractAudio) {
        operations.push({
          type: 'extractAudio',
          format: options.audioFormat
        });
      }
      
      // Add compress operation
      if (options.compress) {
        operations.push({
          type: 'compress',
          preset: 'medium'
        });
      }
      
      // Add resize operation
      if (options.resize) {
        const [width, height] = options.resize.split('x').map(Number);
        operations.push({
          type: 'resize',
          width,
          height,
          keepAspectRatio: true
        });
      }
      
      // Add rotate operation
      if (options.rotate) {
        operations.push({
          type: 'rotate',
          angle: parseInt(options.rotate)
        });
      }
      
      // Add watermark operation
      if (options.watermark) {
        operations.push({
          type: 'addWatermark',
          imagePath: options.watermark,
          position: options.watermarkPosition,
          opacity: 0.7
        });
      }
      
      if (operations.length === 0) {
        console.error('No processing operations specified');
        return;
      }
      
      // Determine output path
      const outputPath = options.output || generateOutputPath(input, operations);
      
      console.log(`Processing video: ${input}`);
      console.log(`Operations: ${operations.map(op => op.type).join(', ')}`);
      
      const result = await downloader.processVideo({
        inputPath: input,
        outputPath,
        operations
      });
      
      if (result.success) {
        console.log(`Processing completed: ${result.outputPath}`);
      } else {
        console.error(`Processing failed: ${result.message}`);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

// Record live stream command
program
  .command('record <url>')
  .description('Record a live stream')
  .option('-o, --output <path>', 'Output directory', './recordings')
  .option('-f, --format <format>', 'Output format (mp4, mkv, etc.)', 'mp4')
  .option('-q, --quality <quality>', 'Video quality', 'highest')
  .option('--max-duration <seconds>', 'Maximum recording duration in seconds')
  .action(async (url, options) => {
    try {
      console.log(`Starting recording of: ${url}`);
      
      const recording = await downloader.recordLiveStream(url, {
        outputPath: options.output,
        format: options.format as Format,
        quality: options.quality as Quality,
        maxDuration: options.maxDuration ? parseInt(options.maxDuration) : undefined,
        onStart: () => console.log('Recording started'),
        onEnd: () => console.log('Recording ended'),
        onError: (error) => console.error(`Recording error: ${error.message}`),
        onProgress: (progress) => {
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0);
          process.stdout.write(`Recording: ${formatDuration(progress.timeElapsed)} (${Math.round(progress.downloaded / 1024 / 1024)}MB)`);
        }
      });
      
      console.log('Press Ctrl+C to stop recording');
      
      // Handle Ctrl+C to stop recording gracefully
      process.on('SIGINT', async () => {
        console.log('\nStopping recording...');
        await recording.stop();
        process.exit(0);
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

// Authentication command
program
  .command('auth <platform>')
  .description('Set authentication for a platform')
  .option('-u, --username <username>', 'Username')
  .option('-p, --password <password>', 'Password')
  .option('-c, --cookies <cookies>', 'Cookies string or file path')
  .action(async (platformStr, options) => {
    try {
      const platform = platformStr.toUpperCase() as keyof typeof Platform;
      
      if (!Platform[platform]) {
        console.error(`Invalid platform: ${platformStr}`);
        console.log('Available platforms:', Object.keys(Platform).join(', '));
        return;
      }
      
      const auth: any = {};
      
      if (options.username) auth.username = options.username;
      if (options.password) auth.password = options.password;
      
      if (options.cookies) {
        // Check if it's a file path
        if (fs.existsSync(options.cookies)) {
          auth.cookies = fs.readFileSync(options.cookies, 'utf-8');
        } else {
          auth.cookies = options.cookies;
        }
      }
      
      if (Object.keys(auth).length === 0) {
        console.error('No authentication information provided');
        return;
      }
      
      downloader.setAuthentication(Platform[platform], auth);
      console.log(`Authentication set for ${platformStr}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

// Helper function to format duration in seconds to HH:MM:SS
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}

// Helper function to generate output path based on operations
function generateOutputPath(inputPath: string, operations: any[]): string {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const name = path.basename(inputPath, ext);
  
  const opSuffix = operations.map(op => op.type).join('-');
  
  // If extracting audio, change extension
  const newExt = operations.some(op => op.type === 'extractAudio') 
    ? `.${operations.find(op => op.type === 'extractAudio').format || 'mp3'}`
    : ext;
  
  return path.join(dir, `${name}-${opSuffix}${newExt}`);
}

// Parse command line arguments
program.parse(process.argv);

// Show help if no arguments provided
if (process.argv.length <= 2) {
  program.help();
}
