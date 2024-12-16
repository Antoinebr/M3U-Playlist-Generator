const fs = require('fs');
const path = require('path');

// Video file extensions to look for
const VIDEO_EXTENSIONS = ['.mkv', '.mp4', '.avi', '.mov', '.wmv'];

function isVideoFile(file) {
    return VIDEO_EXTENSIONS.includes(path.extname(file).toLowerCase());
}

function generateM3UContent(directoryPath, baseDir = null) {
    if (!baseDir) baseDir = directoryPath;
    
    let content = [];
    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        const fullPath = path.join(directoryPath, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            // Recursively process subdirectories
            content = content.concat(generateM3UContent(fullPath, baseDir));
        } else if (stats.isFile() && isVideoFile(file)) {
            // Get relative path from base directory
            const relativePath = path.relative(baseDir, fullPath);
            content.push(relativePath);
        }
    });

    return content;
}

function createM3UPlaylist(directoryPath, outputFile, baseUrl = '') {
    try {
        // Generate M3U content
        const videoFiles = generateM3UContent(directoryPath);
        
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
        fs.writeFileSync(outputFile, m3uContent);
        console.log(`Playlist generated successfully: ${outputFile}`);
        console.log(`Found ${videoFiles.length} video files`);
    } catch (error) {
        console.error('Error generating playlist:', error);
    }
}

// Export the functions for use in server.js
module.exports = {
    generateM3UContent,
    isVideoFile,
    createM3UPlaylist
};
