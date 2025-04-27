/**
 * Basic usage example for Lotus Mansion Video Downloader
 */
const { VideoDownloader, Quality, Format } = require('../dist');

// Create a new downloader instance
const downloader = new VideoDownloader();

/**
 * Example: Download a YouTube video
 */
async function downloadYouTubeVideo() {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Replace with your video URL
  
  try {
    // Check if the URL is supported
    if (!downloader.isSupported(url)) {
      console.error('URL is not supported');
      return;
    }
    
    // Get video information
    console.log('Getting video information...');
    const info = await downloader.getInfo(url);
    console.log('Video information:', info);
    
    // Download the video
    console.log('Downloading video...');
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

/**
 * Example: Download a TikTok video
 */
async function downloadTikTokVideo() {
  const url = 'https://www.tiktok.com/@username/video/1234567890123456789'; // Replace with your video URL
  
  try {
    // Check if the URL is supported
    if (!downloader.isSupported(url)) {
      console.error('URL is not supported');
      return;
    }
    
    // Get video information
    console.log('Getting video information...');
    const info = await downloader.getInfo(url);
    console.log('Video information:', info);
    
    // Download the video
    console.log('Downloading video...');
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

// Run the examples
(async () => {
  console.log('=== YouTube Example ===');
  await downloadYouTubeVideo();
  
  console.log('\n=== TikTok Example ===');
  await downloadTikTokVideo();
})();
