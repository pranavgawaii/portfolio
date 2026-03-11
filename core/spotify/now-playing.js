
import { Buffer } from 'buffer';

const client_id = (process.env.SPOTIFY_CLIENT_ID || '').trim();
const client_secret = (process.env.SPOTIFY_CLIENT_SECRET || '').trim();
const refresh_token = (process.env.SPOTIFY_REFRESH_TOKEN || '').trim();

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token,
        }),
    });

    return response.json();
};

const getNowPlaying = async (access_token) => {
    return fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

const getRecentlyPlayed = async (access_token) => {
    return fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export default async function handler(req, res) {
    try {
        const tokenResponse = await getAccessToken();

        // DEBUG: Check if we actually got a token
        if (tokenResponse.error || !tokenResponse.access_token) {
            return res.status(200).json({
                isPlaying: false,
                debug: {
                    step: 'token_exchange_failed',
                    error: tokenResponse.error,
                    error_description: tokenResponse.error_description,
                    credentialDebug: {
                        clientIdStart: client_id.substring(0, 4),
                        clientSecretStart: client_secret.substring(0, 4),
                        idLength: client_id.length,
                        secretLength: client_secret.length
                    }
                }
            });
        }

        const { access_token } = tokenResponse;
        const nowPlayingRes = await getNowPlaying(access_token);

        let isPlaying = false;
        let item = null;

        // 1. Try "Now Playing" or "Paused" from live endpoint
        let progress_ms = 0;
        let source = 'none';
        let nowPlayingStatus = nowPlayingRes.status;

        if (nowPlayingRes.status === 200) {
            const data = await nowPlayingRes.json();
            if (data.item) {
                item = data.item;
                progress_ms = data.progress_ms;
                isPlaying = data.is_playing;
                source = 'live';
            }
        }

        // 2. Fallback to "Recently Played" if nothing active
        if (!item) {
            const recentlyPlayedRes = await getRecentlyPlayed(access_token);
            if (recentlyPlayedRes.status === 200) {
                const data = await recentlyPlayedRes.json();
                if (data.items && data.items.length > 0) {
                    item = data.items[0].track;
                    isPlaying = false;
                    source = 'history';
                }
            }
        }

        if (!item) {
            return res.status(200).json({
                isPlaying: false,
                debug: {
                    nowPlayingStatus: nowPlayingRes.status,
                    recentStatus: typeof recentlyPlayedRes !== 'undefined' ? recentlyPlayedRes.status : 'skipped',
                    envCheck: {
                        hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
                        hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
                        hasRefreshToken: !!process.env.SPOTIFY_REFRESH_TOKEN,
                    }
                }
            });
        }

        const title = item.name;
        const artist = item.artists.map((_artist) => _artist.name).join(', ');
        const albumImageUrl = item.album.images[0].url;
        const songUrl = item.external_urls.spotify;
        const previewUrl = item.preview_url;
        const durationMs = item.duration_ms;
        const progressMs = progress_ms;

        // Debug info to verify recency
        const playedAt = item.played_at || null;
        const serverTime = new Date().toISOString();

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.status(200).json({
            albumImageUrl,
            artist,
            isPlaying,
            songUrl,
            title,
            previewUrl,
            durationMs,
            progressMs,
            debug: {
                playedAt,
                serverTime,
                source,
                nowPlayingStatus
            }
        });
    } catch (error) {
        console.error('Error fetching Spotify data:', error);
        return res.status(500).json({ error: 'Error fetching data' });
    }
}
