import fetch from 'node-fetch';

// This helper exchanges an authorization code for a refresh token.
// It expects SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to be set in the environment.
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000/callback';
const code = process.argv[2]; // Pass code as argument: node get-spotify-refresh-token.js <authorization_code>

if (!client_id || !client_secret) {
  console.error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in environment.');
  console.error('Set them or export before running this helper.');
  process.exit(1);
}

if (!code) {
  console.error('Usage: node get-spotify-refresh-token.js <authorization_code>');
  process.exit(1);
}

async function getRefreshToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri
    })
  });

  const data = await response.json();
  console.log('Refresh Token:', data.refresh_token);
  console.log('Full Response:', JSON.stringify(data, null, 2));
}

getRefreshToken();
