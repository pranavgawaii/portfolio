// Spotify Now Playing API Proxy
// SECURITY: Do NOT store client secrets or refresh tokens in client-side code.
// This file runs server-side (Vercel Serverless / Node) and must read credentials
// from environment variables. Configure these in your hosting provider (e.g. Vercel):
// - SPOTIFY_CLIENT_ID
// - SPOTIFY_CLIENT_SECRET
// - SPOTIFY_REFRESH_TOKEN

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const hasCredentials = client_id && client_secret && refresh_token;

function safeJson(res, payload) {
  // Always respond with JSON and never leak secrets
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (!hasCredentials) {
    // Graceful fallback for local dev / public repo: return no-playing state.
    // This avoids build/runtime failures for repo users who don't have .env configured.
    return safeJson(res, { isPlaying: false, error: 'MISSING_SPOTIFY_ENV' });
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  try {
    // 1. Get access token using refresh token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
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

    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;

    if (!access_token) {
      return safeJson(res, { isPlaying: false, error: 'TOKEN_FETCH_FAILED' });
    }

    // 2. Fetch currently playing track
    const nowPlayingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (nowPlayingResponse.status === 204 || nowPlayingResponse.status > 400) {
      // If nothing is playing, fallback to last played
      const lastPlayedResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const lastPlayedData = await lastPlayedResponse.json();
      if (lastPlayedData.items && lastPlayedData.items.length > 0) {
        const track = lastPlayedData.items[0].track;
        return safeJson(res, {
          isPlaying: false,
          title: track.name,
          artist: track.artists.map(a => a.name).join(', '),
          album: track.album.name,
          albumImageUrl: track.album.images[0]?.url,
          songUrl: track.external_urls.spotify,
          trackId: track.id,
          previewUrl: track.preview_url || null,
        });
      }
      return safeJson(res, { isPlaying: false });
    }

    const nowPlaying = await nowPlayingResponse.json();
    if (!nowPlaying.item) {
      return safeJson(res, { isPlaying: false });
    }

    return safeJson(res, {
      isPlaying: nowPlaying.is_playing,
      title: nowPlaying.item.name,
      artist: nowPlaying.item.artists.map(a => a.name).join(', '),
      album: nowPlaying.item.album.name,
      albumImageUrl: nowPlaying.item.album.images[0]?.url,
      songUrl: nowPlaying.item.external_urls.spotify,
      trackId: nowPlaying.item.id,
      previewUrl: nowPlaying.item.preview_url || null,
      progressMs: nowPlaying.progress_ms,
      durationMs: nowPlaying.item.duration_ms,
    });
  } catch (err) {
    return safeJson(res, { isPlaying: false, error: 'REQUEST_FAILED' });
  }
}
