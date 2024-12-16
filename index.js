const fs = require('fs');
const path = require('path');

// Video file extensions to look for
const VIDEO_EXTENSIONS = ['.mkv', '.mp4', '.avi', '.mov', '.wmv'];

/**
 * Check if a file is a video based on its extension
 * @param {string} file - File name to check
 * @returns {boolean} - True if file is a video
 */
const isVideoFile = (file) => VIDEO_EXTENSIONS.includes(path.extname(file).toLowerCase());

/**
 * Generate M3U content from a directory
 * @param {string} directoryPath - Path to scan for videos
 * @param {string|null} baseDir - Base directory for relative paths
 * @returns {string[]} - Array of video file paths
 */
const generateM3UContent = async (directoryPath, baseDir = null) => {
    try {
        baseDir = baseDir || directoryPath;
        const files = await fs.promises.readdir(directoryPath);
        
        const processFiles = async () => {
            const results = await Promise.all(
                files.map(async (file) => {
                    const fullPath = path.join(directoryPath, file);
                    const stats = await fs.promises.stat(fullPath);

                    if (stats.isDirectory()) {
                        // Recursively process subdirectories
                        return generateM3UContent(fullPath, baseDir);
                    } else if (stats.isFile() && isVideoFile(file)) {
                        // Get relative path from base directory
                        return [path.relative(baseDir, fullPath)];
                    }
                    return [];
                })
            );

            // Flatten the results array and remove empty entries
            return results.flat().filter(Boolean);
        };

        return await processFiles();
    } catch (error) {
        console.error('Error generating M3U content:', error);
        throw error;
    }
};

/**
 * Create an M3U playlist from a directory
 * @param {string} directoryPath - Path to scan for videos
 * @param {string} outputFile - Path to output M3U file
 * @param {string} baseUrl - Base URL for video file paths
 */
const createM3UPlaylist = async (directoryPath, outputFile, baseUrl = '') => {
    try {
        // Generate M3U content
        const videoFiles = await generateM3UContent(directoryPath);
        
        // Create M3U file content
        let m3uContent = '#EXTM3U\n';
        videoFiles.forEach(file => {
            // Replace backslashes with forward slashes for URLs
            const urlPath = file.replace(/\\/g, '/');
            m3uContent += `#EXTINF:-1,${path.basename(file, path.extname(file))}\n`;
            // Combine base URL with file path, ensuring there's exactly one slash between them
            const fullUrl = `${baseUrl.replace(/\/+$/, '')}/${urlPath}`;
            m3uContent += `${fullUrl}\n`;
        });

        // Write to file
        await fs.promises.writeFile(outputFile, m3uContent);
        console.log(`Playlist generated successfully: ${outputFile}`);
        console.log(`Found ${videoFiles.length} video files`);
    } catch (error) {
        console.error('Error generating playlist:', error);
    }
};

// Export the functions for use in server.js
module.exports = {
    generateM3UContent,
    isVideoFile,
    createM3UPlaylist
};
