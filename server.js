
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple environment variable parser
function loadEnv(filePath) {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        content.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] ? match[2].trim() : '';
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
    }
}

// Load env vars
loadEnv(path.join(__dirname, '.env'));
loadEnv(path.join(__dirname, '.env.local'));

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;

const getAccessToken = async () => {
    return new Promise((resolve, reject) => {
        const data = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: process.env.SPOTIFY_REFRESH_TOKEN || '',
        }).toString();

        const req = https.request(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    if (json.error) return reject(json.error);
                    resolve(json);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
};

const getNowPlaying = async (access_token) => {
    return new Promise((resolve, reject) => {
        const req = https.request(NOW_PLAYING_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }, (res) => {
            if (res.statusCode === 204 || res.statusCode > 400) {
                resolve({ status: res.statusCode, data: null });
                return;
            }

            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ status: 200, data: json });
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
};

const getRecentlyPlayed = async (access_token) => {
    return new Promise((resolve, reject) => {
        const req = https.request(RECENTLY_PLAYED_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
};

const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === '/api/spotify/now-playing') {
        // Disable caching
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        const missingKeys = [];
        if (!process.env.SPOTIFY_CLIENT_ID) missingKeys.push('SPOTIFY_CLIENT_ID');
        if (!process.env.SPOTIFY_CLIENT_SECRET) missingKeys.push('SPOTIFY_CLIENT_SECRET');
        if (!process.env.SPOTIFY_REFRESH_TOKEN) missingKeys.push('SPOTIFY_REFRESH_TOKEN');

        if (missingKeys.length > 0) {
            console.log('Missing keys:', missingKeys);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Missing Spotify credentials',
                details: `Server could not find: ${missingKeys.join(', ')}. Please check .env or .env.local`
            }));
            return;
        }

        try {
            const { access_token } = await getAccessToken();
            let response = await getNowPlaying(access_token);
            let isPlaying = false;
            let item = null;

            // 1. Check if we have a currently active track (playing OR paused)
            if (response.status === 200 && response.data && response.data.item) {
                // If we have an item here, it's either playing or just paused. 
                // We prioritize this over "recently played" history which lags behind.
                item = response.data.item;
                isPlaying = response.data.is_playing; // true or false
            }

            // 2. Only fallback to recently played if NO item was returned above
            if (!item) {
                const recent = await getRecentlyPlayed(access_token);
                if (recent.status === 200 && recent.data && recent.data.items && recent.data.items.length > 0) {
                    item = recent.data.items[0].track;
                    isPlaying = false;
                }
            }

            if (!item) {
                // No current or recent (rare, but possible for new accounts)
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ isPlaying: false }));
                return;
            }

            const title = item.name;
            const artist = item.artists.map((_artist) => _artist.name).join(', ');
            const album = item.album.name;
            const albumImageUrl = item.album.images[0].url;
            const songUrl = item.external_urls.spotify;
            const previewUrl = item.preview_url;
            const durationMs = item.duration_ms;
            const progressMs = response.status === 200 && response.data ? response.data.progress_ms : 0;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                albumImageUrl,
                artist,
                isPlaying,
                songUrl,
                title,
                previewUrl,
                durationMs,
                progressMs
            }));

        } catch (error) {
            console.error('Error in /api/spotify/now-playing:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ isPlaying: false, error: 'Failed to fetch spotify data', details: error.toString() }));
        }
    } else {
        res.writeHead(404);
        res.end();
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Spotify server running on port ${PORT}`);
});
