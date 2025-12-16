// Combined Express server for React build and Spotify API
import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
app.use(cors());

// Read Spotify credentials from environment variables. Do NOT commit secrets.
// Configure these on Vercel (or your hosting provider):
// SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
const hasCredentials = client_id && client_secret && refresh_token;
const basic = client_id && client_secret ? Buffer.from(`${client_id}:${client_secret}`).toString('base64') : null;

app.get('/api/spotify/now-playing', async (req, res) => {
  if (!hasCredentials || !basic) {
    // Graceful fallback so site builds/runs for users without env config
    return res.json({ isPlaying: false, error: 'MISSING_SPOTIFY_ENV' });
  }

  try {
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
      return res.json({ isPlaying: false, error: 'TOKEN_FETCH_FAILED' });
    }

    const nowPlayingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (nowPlayingResponse.status === 204 || nowPlayingResponse.status > 400) {
      const lastPlayedResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const lastPlayedData = await lastPlayedResponse.json();
      if (lastPlayedData.items && lastPlayedData.items.length > 0) {
        const track = lastPlayedData.items[0].track;
        return res.json({
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
      return res.json({ isPlaying: false });
    }

    const nowPlaying = await nowPlayingResponse.json();
    if (!nowPlaying.item) {
      return res.json({ isPlaying: false });
    }

    const response = {
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
    };

    return res.json(response);
  } catch (err) {
    return res.json({ isPlaying: false, error: 'REQUEST_FAILED' });
  }
});

// Return a fresh access token for client-side SDK or direct API calls
app.get('/api/spotify/token', async (req, res) => {
  if (!hasCredentials || !basic) {
    return res.status(200).json({ error: 'MISSING_SPOTIFY_ENV' });
  }

  try {
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
    if (tokenData.error) return res.status(500).json(tokenData);
    return res.json({ access_token: tokenData.access_token, expires_in: tokenData.expires_in });
  } catch (err) {
    return res.status(500).json({ error: 'token_error', details: String(err) });
  }
});

// Serve React static files
app.use(express.static(path.join(__dirname, 'dist')));


// Fallback to index.html for SPA (must be last)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Combined server running on http://localhost:${PORT}`);
});
