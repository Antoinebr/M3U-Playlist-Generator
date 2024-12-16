# 📺 M3U Playlist Generator for IPTV

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen.svg)](https://nodejs.org/)

A powerful Node.js application that automatically generates M3U playlists from your local video directory, perfect for IPTV players and smart TVs. Stream your media collection with secure HTTP authentication.

## 🌟 Features

- **Automatic M3U Generation**: Scans your video directory and creates an IPTV-compatible playlist
- **Directory Structure Preservation**: Maintains your folder organization in the playlist
- **Secure Access**: 
  - API key protection for playlist generation
  - HTTP Basic Authentication for video streams
  - Perfect for private media collections
- **IPTV Compatible**: Works with popular IPTV players and smart TV applications
- **Multiple Video Formats**: Supports MKV, MP4, AVI, MOV, and WMV files

## 🚀 Quick Start

### Prerequisites

- Node.js (>= 14.0.0)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/antoinebr/m3u-playlist-generator.git
cd m3u-playlist-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create your environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
PORT=3000
API_KEY=your_secret_api_key_here
VIDEOS_PATH=./videos
BASE_URL=https://your-domain.com
HTTP_AUTH_USERNAME=your_username
HTTP_AUTH_PASSWORD=your_password
```

### Usage

1. Start the server:
```bash
# Development
npm run dev

# Production
npm run prod
```

2. Access your playlist:
```
https://your-domain.com/playlist?code=your_secret_api_key_here
```

## 📁 Directory Structure

Your video files can be organized in any structure:
```
videos/
├── Movies/
│   ├── Action/
│   │   └── Movie1.mkv
│   └── Comedy/
│       └── Movie2.mp4
└── TVShows/
    └── Show1/
        ├── S01E01.mkv
        └── S01E02.mkv
```

## 🔒 Security

The application provides two layers of security:
1. API Key protection for playlist generation
2. HTTP Basic Authentication for video file access

## 🎮 Compatible Players

- VLC Media Player
- IPTV Smarters
- Perfect Player
- GSE Smart IPTV
- TiviMate
- Most Smart TV IPTV apps

## 🛠️ API Endpoints

- `GET /playlist?code=API_KEY`: Generate and download M3U playlist
- `GET /health`: Check server status

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | Yes |
| API_KEY | Secret key for playlist access | Yes |
| VIDEOS_PATH | Path to video directory | Yes |
| BASE_URL | Base URL for video access | Yes |
| HTTP_AUTH_USERNAME | Basic auth username | Yes |
| HTTP_AUTH_PASSWORD | Basic auth password | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Star Us!

If you find this project useful, please give it a star on GitHub! It helps others discover this tool.

## 🔗 Related Projects

- [IPTV Players](https://github.com/topics/iptv-player)
- [Media Servers](https://github.com/topics/media-server)
- [Streaming Tools](https://github.com/topics/streaming)
