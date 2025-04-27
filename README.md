# 🚀 Lotus Mansion Video Downloader API

The ultimate comprehensive video downloader API library for multiple platforms including YouTube, TikTok, Instagram, Twitter/X, Facebook, Vimeo, Dailymotion, Twitch, and more.

Created by Lotus Mansion Team, Hexa Nirnamika, and Sentino.

## ✨ Features

### 🎥 Platform Support
- ✅ Download videos from multiple platforms:
  - YouTube (videos, shorts, playlists, channels)
  - TikTok (videos, profiles, hashtags)
  - Instagram (posts, reels, stories, IGTV)
  - Twitter/X (tweets with videos)
  - Facebook (videos, reels, stories)
  - Vimeo (videos, showcases)
  - Dailymotion (videos, playlists)
  - Twitch (clips, VODs, streams)
  - Reddit (videos, GIFs)
  - Pinterest (pins with videos)
  - LinkedIn (posts with videos)
  - Snapchat (public stories)

### 🛠️ Core Features
- ✅ Download videos without watermarks
- ✅ Multiple quality options (4K, 1080p, 720p, etc.)
- ✅ Multiple format options (MP4, MP3, WEBM, MKV, AVI, etc.)
- ✅ Extract comprehensive video information and metadata
- ✅ Batch downloading (multiple videos, playlists, channels)
- ✅ Download progress tracking with events
- ✅ Proxy support for region-restricted content
- ✅ Rate limiting and throttling to avoid API bans
- ✅ Automatic retries with exponential backoff
- ✅ Custom HTTP headers and cookies support

### 🧰 Advanced Features
- ✅ Video trimming and cutting
- ✅ Video merging and concatenation
- ✅ Audio extraction and manipulation
- ✅ Subtitle/caption extraction and embedding
- ✅ Thumbnail extraction and generation
- ✅ Video format conversion
- ✅ Video compression
- ✅ Metadata editing
- ✅ Live stream recording
- ✅ Scheduled downloads

### 💻 Developer Experience
- ✅ TypeScript support with full type definitions
- ✅ Promise-based API with async/await support
- ✅ Event-driven architecture
- ✅ Modular design for easy extension
- ✅ Comprehensive documentation
- ✅ CLI tool for command-line usage

## Installation

```bash
npm install lotus-mansion-video-downloader
```

## Quick Start

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

## API Reference

### VideoDownloader

The main class for downloading videos from various platforms.

#### Methods

##### `isSupported(url: string): boolean`

Checks if a URL is supported by the downloader.

```javascript
const isSupported = downloader.isSupported('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
console.log(isSupported); // true
```

##### `getInfo(url: string): Promise<VideoInfo>`

Gets information about a video.

```javascript
const info = await downloader.getInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
console.log(info);
```

##### `download(url: string, options?: DownloadOptions): Promise<DownloadResult>`

Downloads a video.

```javascript
const result = await downloader.download('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
  quality: Quality.HIGHEST,
  format: Format.MP4,
  outputPath: './downloads',
});
```

### Platform-Specific Downloaders

You can also use platform-specific downloaders directly:

```javascript
const { YouTubeDownloader } = require('lotus-mansion-video-downloader');

const youtubeDownloader = new YouTubeDownloader();
const result = await youtubeDownloader.download('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
```

### Types

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

#### `Quality`

```typescript
enum Quality {
  HIGHEST = 'highest',
  LOWEST = 'lowest',
  AUDIO_ONLY = 'audio',
  HD = 'hd',
  SD = 'sd',
}
```

#### `Format`

```typescript
enum Format {
  MP4 = 'mp4',
  MP3 = 'mp3',
  WEBM = 'webm',
}
```

#### `Platform`

```typescript
enum Platform {
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
}
```

## Advanced Usage

### Custom Output Path

```javascript
const result = await downloader.download(url, {
  outputPath: './my-videos',
  fileName: 'custom-name.mp4',
});
```

### Download Audio Only

```javascript
const result = await downloader.download(url, {
  quality: Quality.AUDIO_ONLY,
  format: Format.MP3,
});
```

### Download Highest Quality

```javascript
const result = await downloader.download(url, {
  quality: Quality.HIGHEST,
});
```

### Batch Download (Multiple URLs)

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

### Download with Progress Tracking

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

### Download Playlist

```javascript
const playlistUrl = 'https://www.youtube.com/playlist?list=PLplaylist-id';

const playlist = await downloader.getPlaylistInfo(playlistUrl);
console.log(`Playlist: ${playlist.title}`);
console.log(`Videos: ${playlist.videos.length}`);

const results = await downloader.downloadPlaylist(playlistUrl, {
  quality: Quality.HD,
  format: Format.MP4,
  outputPath: './downloads/playlists/' + playlist.title,
  concurrency: 2,
  onProgress: (progress) => {
    console.log(`Playlist download progress: ${progress.percentage}%`);
  }
});
```

### Video Processing

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

// Add watermark
const watermarkResult = await downloader.processVideo({
  inputPath: './downloads/video.mp4',
  outputPath: './processed/watermarked.mp4',
  operations: [
    {
      type: 'addWatermark',
      imagePath: './assets/watermark.png',
      position: 'bottomRight',
      opacity: 0.7
    }
  ]
});
```

### Using Proxy

```javascript
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
```

### Authentication for Private Content

```javascript
// For platforms that require authentication (Instagram, Facebook, etc.)
downloader.setAuthentication(Platform.INSTAGRAM, {
  username: 'your_username',
  password: 'your_password'
});

// Or using cookies
downloader.setAuthentication(Platform.INSTAGRAM, {
  cookies: 'cookie1=value1; cookie2=value2'
});

// Now you can download private content
const result = await downloader.download('https://www.instagram.com/p/private-post-id/');
```

### Live Stream Recording

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

### Scheduled Downloads

```javascript
const schedule = downloader.scheduleDownload({
  url: 'https://www.youtube.com/watch?v=video-id',
  options: {
    quality: Quality.HIGHEST,
    format: Format.MP4,
    outputPath: './scheduled-downloads/'
  },
  schedule: {
    date: new Date('2023-12-31T23:59:59'),
    repeat: 'weekly', // 'once', 'daily', 'weekly', 'monthly'
    days: ['monday', 'wednesday', 'friday'] // For weekly schedule
  },
  onComplete: (result) => console.log('Scheduled download completed:', result)
});

// Cancel scheduled download
schedule.cancel();
```

## Platform Support

| Platform     | Status      | Features                                                                                |
|--------------|-------------|-----------------------------------------------------------------------------------------|
| YouTube      | ✅ Supported | Videos, shorts, playlists, channels, livestreams, age-restricted content               |
| TikTok       | ✅ Supported | Videos, profiles, hashtags, watermark removal, bulk downloading                        |
| Instagram    | ✅ Supported | Posts, reels, stories, IGTV, profiles, hashtags, private content (with authentication) |
| Twitter/X    | ✅ Supported | Tweets with videos, profiles, hashtags, spaces recordings                              |
| Facebook     | ✅ Supported | Videos, reels, stories, pages, groups (with authentication)                            |
| Vimeo        | ✅ Supported | Videos, showcases, channels, staff picks                                               |
| Dailymotion  | ✅ Supported | Videos, playlists, channels                                                            |
| Twitch       | ✅ Supported | Clips, VODs, livestreams, channels                                                     |
| Reddit       | ✅ Supported | Videos, GIFs, subreddits                                                              |
| Pinterest    | ✅ Supported | Pins with videos, boards                                                               |
| LinkedIn     | ✅ Supported | Posts with videos (with authentication)                                                |
| Snapchat     | ✅ Supported | Public stories, spotlight                                                              |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [ytdl-core](https://github.com/fent/node-ytdl-core) - YouTube downloader
- [axios](https://github.com/axios/axios) - HTTP client

## Disclaimer

This library is for educational purposes only. Please respect the terms of service of the platforms you are downloading from and the copyright of the content creators.

## Command-Line Interface (CLI)

The library includes a powerful CLI tool for downloading videos from the command line.

### Installation

```bash
# Install globally
npm install -g lotus-mansion-video-downloader

# Or run directly with npx
npx lotus-mansion-video-downloader
```

### Usage

```bash
# Show help
lotus-downloader --help

# Download a video
lotus-downloader download https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Download with options
lotus-downloader download https://www.youtube.com/watch?v=dQw4w9WgXcQ --quality 1080p --format mp4 --output ./my-videos

# Download audio only
lotus-downloader download https://www.youtube.com/watch?v=dQw4w9WgXcQ --audio-only

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

### Available Commands

- `download`: Download a single video
- `batch`: Download multiple videos from a file
- `playlist`: Download all videos in a playlist
- `info`: Get information about a video, playlist, or channel
- `process`: Process a video file (trim, extract audio, etc.)
- `record`: Record a live stream
- `auth`: Set authentication for a platform

## Authors

- Lotus Mansion Team
- Hexa Nirnamika
- Sentino
