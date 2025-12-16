// Minimal Express server for Spotify Now Playing API
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3000; // Use the same port as Vite for API proxy
app.use(cors());

// Read Spotify credentials from environment variables. Configure in your host (Vercel):
// SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
const basic = client_id && client_secret ? Buffer.from(`${client_id}:${client_secret}`).toString('base64') : null;

app.get('/api/spotify/now-playing', async (req, res) => {
  if (!client_id || !client_secret || !refresh_token || !basic) {
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

    if (!access_token) return res.json({ isPlaying: false });

    const nowPlayingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (nowPlayingResponse.status === 204 || nowPlayingResponse.status > 400) {
      return res.json({ isPlaying: false });
    }

    const nowPlaying = await nowPlayingResponse.json();
    if (!nowPlaying.item) return res.json({ isPlaying: false });

    res.json({
      isPlaying: nowPlaying.is_playing,
      title: nowPlaying.item.name,
      artist: nowPlaying.item.artists.map(a => a.name).join(', '),
      album: nowPlaying.item.album.name,
      albumImageUrl: nowPlaying.item.album.images[0]?.url,
      songUrl: nowPlaying.item.external_urls.spotify,
      progressMs: nowPlaying.progress_ms,
      durationMs: nowPlaying.item.duration_ms,
    });
  } catch (err) {
    return res.json({ isPlaying: false, error: 'REQUEST_FAILED' });
  }
});

app.listen(PORT, () => {
  console.log(`Spotify API proxy running on http://localhost:${PORT}/api/spotify/now-playing`);
});
