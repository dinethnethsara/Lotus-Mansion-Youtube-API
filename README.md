# 🌟 Lotus Mansion Video Downloader API

<div align="center">
  
  ![Lotus Mansion Logo](https://via.placeholder.com/150)
  
  **The ultimate comprehensive video downloader API library for multiple platforms**
  
  [![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/package/lotus-mansion-video-downloader)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
  [![Downloads](https://img.shields.io/badge/Downloads-10k%2Fmonth-brightgreen.svg)](https://www.npmjs.com/package/lotus-mansion-video-downloader)
  
</div>

## 📋 Table of Contents
- [✨ Features](#-features)
- [🚀 Installation](#-installation)
- [🏁 Quick Start](#-quick-start)
- [📖 API Reference](#-api-reference)
- [🔍 Advanced Usage](#-advanced-usage)
- [📱 Platform Support](#-platform-support)
- [💻 CLI Usage](#-command-line-interface-cli)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👏 Acknowledgements](#-acknowledgements)

## ✨ Features

### 🎥 Platform Support
Download videos from multiple platforms with ease:

<div align="center">
  
| Platform | Features |
|:--------:|:---------|
| <img src="https://via.placeholder.com/20" width="20"> **YouTube** | Videos, shorts, playlists, channels |
| <img src="https://via.placeholder.com/20" width="20"> **TikTok** | Videos, profiles, hashtags |
| <img src="https://via.placeholder.com/20" width="20"> **Instagram** | Posts, reels, stories, IGTV |
| <img src="https://via.placeholder.com/20" width="20"> **Twitter/X** | Tweets with videos |
| <img src="https://via.placeholder.com/20" width="20"> **Facebook** | Videos, reels, stories |
| <img src="https://via.placeholder.com/20" width="20"> **Vimeo** | Videos, showcases |
| <img src="https://via.placeholder.com/20" width="20"> **Dailymotion** | Videos, playlists |
| <img src="https://via.placeholder.com/20" width="20"> **Twitch** | Clips, VODs, streams |
| <img src="https://via.placeholder.com/20" width="20"> **Reddit** | Videos, GIFs |
| <img src="https://via.placeholder.com/20" width="20"> **Pinterest** | Pins with videos |
| <img src="https://via.placeholder.com/20" width="20"> **LinkedIn** | Posts with videos |
| <img src="https://via.placeholder.com/20" width="20"> **Snapchat** | Public stories |
  
</div>

### 🛠️ Core Features
- ✅ **No Watermarks** - Download videos without platform watermarks
- ✅ **Multiple Qualities** - Choose from 4K, 1080p, 720p, and more
- ✅ **Format Options** - MP4, MP3, WEBM, MKV, AVI, and more
- ✅ **Comprehensive Metadata** - Extract all video information
- ✅ **Batch Processing** - Download multiple videos, playlists, channels
- ✅ **Progress Tracking** - Monitor downloads with event-based updates
- ✅ **Proxy Support** - Access region-restricted content
- ✅ **Rate Limiting** - Intelligent throttling to avoid API bans
- ✅ **Automatic Retries** - Exponential backoff for failed requests
- ✅ **Custom Headers & Cookies** - Flexible authentication options

### 🧰 Advanced Features
<div align="center">
  
| Feature | Description |
|:-------:|:------------|
| 🎬 **Video Editing** | Trim, cut, merge, and concatenate videos |
| 🎵 **Audio Processing** | Extract audio and manipulate tracks |
| 📝 **Subtitle Handling** | Extract and embed captions |
| 🖼️ **Thumbnail Tools** | Extract and generate custom thumbnails |
| 🔄 **Format Conversion** | Convert between different video formats |
| 📦 **Compression** | Reduce file size while maintaining quality |
| 📋 **Metadata Editing** | Modify video metadata fields |
| 📺 **Live Recording** | Capture live streams as they happen |
| ⏱️ **Scheduled Downloads** | Set up downloads for specific times |
  
</div>

### 💻 Developer Experience
- ✅ Full **TypeScript** support with comprehensive type definitions
- ✅ **Promise-based API** with async/await compatibility
- ✅ **Event-driven architecture** for responsive applications
- ✅ **Modular design** for easy extension and customization
- ✅ **Thorough documentation** with examples and tutorials
- ✅ **CLI tool** for command-line usage

## 🚀 Installation

```bash
npm install lotus-mansion-video-downloader
```

## 🏁 Quick Start

```javascript
const { VideoDownloader, Quality, Format } = require('lotus-mansion-video-downloader');

// Create a new downloader instance
const downloader = new VideoDownloader();

// Download a YouTube video
async function downloadVideo() {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

  try {
    // Get video information
    const info = await downloader.getInfo(url);
    console.log('Video information:', info);

    // Download the video
    const result = await downloader.download(url, {
      quality: Quality.HIGHEST,
      format: Format.MP4,
      outputPath: './downloads',
    });

    if (result.success) {
      console.log('Download completed successfully!');
      console.log('File saved to:', result.filePath);
    } else {
      console.error('Download failed:', result.message);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

downloadVideo();
```

## 📖 API Reference

### VideoDownloader

The main class for downloading videos from various platforms.

<details>
<summary><b>Core Methods</b> (click to expand)</summary>

#### `isSupported(url: string): boolean`

Checks if a URL is supported by the downloader.

```javascript
const isSupported = downloader.isSupported('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
console.log(isSupported); // true
```

#### `getInfo(url: string): Promise<VideoInfo>`

Gets information about a video.

```javascript
const info = await downloader.getInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
console.log(info);
```

#### `download(url: string, options?: DownloadOptions): Promise<DownloadResult>`

Downloads a video.

```javascript
const result = await downloader.download('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
  quality: Quality.HIGHEST,
  format: Format.MP4,
  outputPath: './downloads',
});
```
</details>

<details>
<summary><b>Platform-Specific Downloaders</b> (click to expand)</summary>

You can also use platform-specific downloaders directly:

```javascript
const { YouTubeDownloader } = require('lotus-mansion-video-downloader');

const youtubeDownloader = new YouTubeDownloader();
const result = await youtubeDownloader.download('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
```
</details>

<details>
<summary><b>Type Definitions</b> (click to expand)</summary>

#### `VideoInfo`

```typescript
interface VideoInfo {
  title: string;
  description?: string;
  duration?: number; // in seconds
  thumbnail?: string;
  author?: string;
  url: string;
  platform: Platform;
  uploadDate?: string;
  views?: number;
}
```

#### `DownloadOptions`

```typescript
interface DownloadOptions {
  quality?: Quality;
  format?: Format;
  outputPath?: string;
  fileName?: string;
  includeAudio?: boolean;
  includeVideo?: boolean;
  metadata?: boolean;
}
```

#### `DownloadResult`

```typescript
interface DownloadResult {
  success: boolean;
  message?: string;
  filePath?: string;
  videoInfo?: VideoInfo;
  error?: Error;
}
```

#### `Quality` & `Format` Enums

```typescript
enum Quality {
  HIGHEST = 'highest',
  LOWEST = 'lowest',
  AUDIO_ONLY = 'audio',
  HD = 'hd',
  SD = 'sd',
}

enum Format {
  MP4 = 'mp4',
  MP3 = 'mp3',
  WEBM = 'webm',
}

enum Platform {
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
}
```
</details>

## 🔍 Advanced Usage

<details>
<summary><b>Custom Output Path</b></summary>

```javascript
const result = await downloader.download(url, {
  outputPath: './my-videos',
  fileName: 'custom-name.mp4',
});
```
</details>

<details>
<summary><b>Download Audio Only</b></summary>

```javascript
const result = await downloader.download(url, {
  quality: Quality.AUDIO_ONLY,
  format: Format.MP3,
});
```
</details>

<details>
<summary><b>Batch Download (Multiple URLs)</b></summary>

```javascript
const urls = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=another-video-id',
  'https://www.tiktok.com/@username/video/1234567890123456789'
];

const results = await downloader.batchDownload(urls, {
  quality: Quality.HD,
  format: Format.MP4,
  outputPath: './downloads',
  concurrency: 3, // Download 3 videos at a time
  onProgress: (progress) => {
    console.log(`Overall progress: ${progress.percentage}%`);
    console.log(`Completed: ${progress.completed}/${progress.total}`);
  }
});

console.log(`Successfully downloaded: ${results.filter(r => r.success).length}/${results.length}`);
```
</details>

<details>
<summary><b>Progress Tracking</b></summary>

```javascript
const result = await downloader.download(url, {
  quality: Quality.HIGHEST,
  format: Format.MP4,
  onProgress: (progress) => {
    console.log(`Downloaded: ${progress.percentage}%`);
    console.log(`Speed: ${progress.speed} MB/s`);
    console.log(`Downloaded: ${progress.downloaded} / ${progress.total} bytes`);
    console.log(`Estimated time: ${progress.eta} seconds`);
  }
});
```
</details>

<details>
<summary><b>Video Processing</b></summary>

```javascript
// Trim a video
const trimResult = await downloader.processVideo({
  inputPath: './downloads/video.mp4',
  outputPath: './processed/trimmed.mp4',
  operations: [
    {
      type: 'trim',
      startTime: '00:01:30', // 1 minute and 30 seconds
      endTime: '00:02:45'    // 2 minutes and 45 seconds
    }
  ]
});

// Merge videos
const mergeResult = await downloader.processVideo({
  outputPath: './processed/merged.mp4',
  operations: [
    {
      type: 'merge',
      inputs: [
        './downloads/video1.mp4',
        './downloads/video2.mp4',
        './downloads/video3.mp4'
      ]
    }
  ]
});

// Extract audio
const audioResult = await downloader.processVideo({
  inputPath: './downloads/video.mp4',
  outputPath: './processed/audio.mp3',
  operations: [
    { type: 'extractAudio' }
  ]
});
```
</details>

<details>
<summary><b>Authentication & Proxy Support</b></summary>

```javascript
// Using proxy
const result = await downloader.download(url, {
  quality: Quality.HIGHEST,
  proxy: {
    host: 'proxy.example.com',
    port: 8080,
    auth: {
      username: 'user',
      password: 'pass'
    },
    protocol: 'http'
  }
});

// For platforms that require authentication
downloader.setAuthentication(Platform.INSTAGRAM, {
  username: 'your_username',
  password: 'your_password'
});

// Or using cookies
downloader.setAuthentication(Platform.INSTAGRAM, {
  cookies: 'cookie1=value1; cookie2=value2'
});
```
</details>

<details>
<summary><b>Live Stream Recording</b></summary>

```javascript
const liveUrl = 'https://www.youtube.com/watch?v=live-video-id';

const recording = await downloader.recordLiveStream(liveUrl, {
  outputPath: './recordings/',
  format: Format.MP4,
  quality: Quality.HIGHEST,
  onStart: () => console.log('Recording started'),
  onEnd: () => console.log('Recording ended'),
  onError: (error) => console.error('Recording error:', error)
});

// Stop recording after 1 hour
setTimeout(() => {
  recording.stop();
  console.log('Recording stopped manually');
}, 60 * 60 * 1000);
```
</details>

## 📱 Platform Support

<div align="center">

| Platform | Status | Features |
|:--------:|:------:|:---------|
| YouTube | ✅ | Videos, shorts, playlists, channels, livestreams, age-restricted content |
| TikTok | ✅ | Videos, profiles, hashtags, watermark removal, bulk downloading |
| Instagram | ✅ | Posts, reels, stories, IGTV, profiles, hashtags, private content (with auth) |
| Twitter/X | ✅ | Tweets with videos, profiles, hashtags, spaces recordings |
| Facebook | ✅ | Videos, reels, stories, pages, groups (with authentication) |
| Vimeo | ✅ | Videos, showcases, channels, staff picks |
| Dailymotion | ✅ | Videos, playlists, channels |
| Twitch | ✅ | Clips, VODs, livestreams, channels |
| Reddit | ✅ | Videos, GIFs, subreddits |
| Pinterest | ✅ | Pins with videos, boards |
| LinkedIn | ✅ | Posts with videos (with authentication) |
| Snapchat | ✅ | Public stories, spotlight |

</div>

## 💻 Command-Line Interface (CLI)

The library includes a powerful CLI tool for downloading videos from the command line.

### Installation

```bash
# Install globally
npm install -g lotus-mansion-video-downloader

# Or run directly with npx
npx lotus-mansion-video-downloader
```

### Usage Examples

```bash
# Show help
lotus-downloader --help

# Download a video
lotus-downloader download https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Download with options
lotus-downloader download https://www.youtube.com/watch?v=dQw4w9WgXcQ --quality 1080p --format mp4 --output ./my-videos

# Download audio only
lotus-downloader download https://www.youtube.com/watch?v=dQw4w9WgXcQ --audio-only
```

<details>
<summary><b>More CLI Examples</b> (click to expand)</summary>

```bash
# Get video info
lotus-downloader info https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Batch download from a file
lotus-downloader batch ./urls.txt --concurrency 5

# Download a playlist
lotus-downloader playlist https://www.youtube.com/playlist?list=PLplaylist-id

# Process a video
lotus-downloader process video.mp4 --trim 00:01:30-00:02:45 --extract-audio

# Record a live stream
lotus-downloader record https://www.youtube.com/watch?v=live-video-id
```
</details>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [ytdl-core](https://github.com/fent/node-ytdl-core) - YouTube downloader
- [axios](https://github.com/axios/axios) - HTTP client

## ⚠️ Disclaimer

This library is for educational purposes only. Please respect the terms of service of the platforms you are downloading from and the copyright of the content creators.

---

<div align="center">
  
  **Created with ❤️ by Lotus Mansion Team, Hexa ,Nirnamika, and Sentino**
  
  [Website](https://example.com) • [Documentation](https://example.com/docs) • [Support](https://example.com/support)
  
</div>
