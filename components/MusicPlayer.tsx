
import React, { useEffect, useRef, useState } from 'react';
import { Music, Play, X, Pause } from 'lucide-react';

const MusicPlayer = () => {
  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEmbed, setShowEmbed] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

  useEffect(() => {
    // Load cached track from localStorage first (so UI doesn't disappear)
    try {
      const cached = localStorage.getItem('lastPlayedTrack');
      if (cached) setTrack(JSON.parse(cached));
    } catch (e) {}

    const fetchTrack = async () => {
      try {
        const res = await fetch('/api/spotify/now-playing');
        if (!res.ok) return; // don't clear existing track on error
        const data = await res.json();
        // Only update when we have a valid title (avoid replacing with empty responses)
        if (data && (data.title || data.artist)) {
          setTrack(data);
          try { localStorage.setItem('lastPlayedTrack', JSON.stringify(data)); } catch(e) {}
        }
      } catch (e) {
        // network or fetch failed — keep existing cached track
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // Manage audio element events for preview playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPreviewPlaying(false);
      setExpanded(false);
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      try { audio.src = ''; } catch (e) {}
      setCurrentTime(0);
      setDuration(0);
    };
  }, [track?.trackId]);

  // Load Spotify Web Playback SDK (if user wants full playback)
  const loadSpotifySDK = async () => {
    if ((window as any).Spotify) {
      setSdkReady(true);
      return (window as any).Spotify;
    }
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://sdk.scdn.co/spotify-player.js';
      s.async = true;
      s.onload = () => {
        setSdkReady(true);
        resolve((window as any).Spotify);
      };
      s.onerror = reject;
      document.body.appendChild(s);
    });
  };

  // Initialize Web Playback SDK and transfer playback to the in-page player
  const initWebPlayerAndPlay = async () => {
    try {
      const tokenRes = await fetch('/api/spotify/token');
      const tokenJson = await tokenRes.json();
      if (tokenJson.error) {
        console.error('token error', tokenJson);
        return;
      }
      const token = tokenJson.access_token;
      setSpotifyToken(token);

      const Spotify = await loadSpotifySDK();
      const player = new Spotify.Player({
        name: 'Portfolio Player',
        getOAuthToken: cb => cb(token),
      });

      // Error handling
      player.addListener('initialization_error', ({ message }: any) => { console.error(message); });
      player.addListener('authentication_error', ({ message }: any) => { console.error(message); });
      player.addListener('account_error', ({ message }: any) => { console.error(message); });
      player.addListener('playback_error', ({ message }: any) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', (state: any) => {
        if (!state) return;
        // state contains position/duration etc
      });

      // Ready
      player.addListener('ready', ({ device_id }: any) => {
        setDeviceId(device_id);
        // Transfer playback to our device and start playing
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ uris: [track.songUrl] || [`spotify:track:${track.trackId}`] }),
        }).then(r => {
          if (!r.ok) console.error('play failed', r.status);
        }).catch(console.error);
      });

      // Connect!
      player.connect();
    } catch (e) {
      console.error('initWebPlayer failed', e);
    }
  };

  // Always render the player card. If still loading and no cached track, show minimal placeholder.
  const display = track || { isPlaying: false, title: 'No recent tracks', artist: 'Start playing music on Spotify!', albumImageUrl: null };

  return (
    <>
      <div className="w-full max-w-2xl mt-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-sm flex items-center gap-4" style={{minHeight: 88}}>
      {/* Album Art */}
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800 flex items-center justify-center">
          {display.albumImageUrl ? (
            <img
            src={display.albumImageUrl}
            alt={display.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Music className="w-8 h-8 text-neutral-700" />
        )}
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center h-full gap-1">
        <div className="flex items-center gap-2 mb-1">
          <svg viewBox="0 0 168 168" width="20" height="20" fill="currentColor" className="text-green-500"><path d="M84 0a84 84 0 1 0 0 168 84 84 0 0 0 0-168zm38.7 120.5c-1.3 2.1-3.9 2.8-6 1.5-16.4-10-37.1-12.3-61.5-6.7-2.4.5-4.7-1-5.2-3.3-.5-2.4 1-4.7 3.3-5.2 26.2-5.9 48.7-3.4 66.7 7.5 2.1 1.3 2.8 3.9 1.5 6zm8.5-18.2c-1.6 2.6-5 3.4-7.5 1.8-18.8-11.5-47.6-14.9-69.9-8.1-2.9.9-6-.7-6.9-3.6-.9-2.9.7-6 3.6-6.9 24.8-7.4 56.1-3.7 77.1 9.2 2.6 1.6 3.4 5 1.8 7.6zm.7-18.7C110.7 74 87.2 71.6 62.7 78.2c-3.4.9-6.9-1-7.8-4.4-.9-3.4 1-6.9 4.4-7.8 27.7-7.4 54.1-4.7 74.2 8.1 3 1.9 3.9 5.9 2 8.9z" /></svg>
            <span className="text-sm font-medium text-green-400">
            {display.isPlaying ? 'Now playing' : 'Last played'}
          </span>
        </div>
        <div className="text-lg font-bold text-white truncate">
          {display.title}
        </div>
        <div className="text-sm text-neutral-400 truncate">
          {display.artist ? `by ${display.artist}` : ''}
        </div>
      </div>
      {/* Spotify Play Button / Preview */}
      {display.trackId && (
        <div className="flex items-center gap-2">
          {display.previewUrl ? (
            <button
              onClick={() => {
                const audio = audioRef.current;
                if (!audio) return;
                if (audio.src !== display.previewUrl) {
                  audio.src = display.previewUrl;
                  audio.crossOrigin = 'anonymous';
                }
                if (isPreviewPlaying) {
                  audio.pause();
                  setIsPreviewPlaying(false);
                  setExpanded(false);
                } else {
                  // try to play; user gesture ensures play is allowed
                  audio.currentTime = 0;
                  audio.play().catch(() => {});
                  setIsPreviewPlaying(true);
                  setExpanded(true);
                }
              }}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-800 hover:bg-green-600 transition-colors group"
              title={isPreviewPlaying ? 'Pause preview' : 'Play preview'}
            >
              {isPreviewPlaying ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>
          ) : (
            <button
              onClick={() => setShowEmbed(!showEmbed)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-800 hover:bg-green-600 transition-colors group"
              title={showEmbed ? "Hide player" : "Play on website"}
            >
              {showEmbed ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>
          )}
        </div>
      )}
      </div>

      {/* Embedded Player Inline */}
      {showEmbed && display.trackId && (
        <div className="mt-4 w-full max-w-2xl">
          <iframe
            key={display.trackId}
            src={`https://open.spotify.com/embed/track/${display.trackId}`}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-2xl border border-neutral-800"
          ></iframe>
        </div>
      )}

      {/* Modal player for bigger view (optional) */}
      {showEmbed && display.trackId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-hidden={!showEmbed}
        >
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowEmbed(false)} />
          <div className="relative w-full max-w-3xl bg-neutral-900 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-3 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-neutral-800">
                  {display.albumImageUrl ? (
                    <img src={display.albumImageUrl} alt={display.title} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{display.title}</div>
                  <div className="text-xs text-neutral-400 truncate">{display.artist}</div>
                </div>
              </div>
              <button
                onClick={() => setShowEmbed(false)}
                className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700"
                aria-label="Close player"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <iframe
              key={`modal-${display.trackId}`}
              src={`https://open.spotify.com/embed/track/${display.trackId}`}
              width="100%"
              height="480"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      )}
      {/* Animated expanded player */}
      <div
        className={`w-full max-w-2xl mt-4 bg-neutral-900 rounded-2xl overflow-hidden transition-all duration-300 ${expanded ? 'border border-neutral-800 max-h-72 p-4' : 'max-h-0 p-0'}`}
        aria-hidden={!expanded}
      >
        {expanded && (
          <div>
            <div className="mb-3">
              <div className="text-sm font-semibold text-white">{track.title} <span className="text-neutral-500">up next: {track.title}</span></div>
              <div className="text-xs text-neutral-400">{track.artist}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-neutral-400">{formatTime(currentTime)}</div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={Math.min(currentTime, duration || 0)}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (audioRef.current) audioRef.current.currentTime = val;
                  setCurrentTime(val);
                }}
                className="flex-1 h-1 bg-neutral-700 accent-green-500 rounded-lg"
              />
              <div className="text-xs text-neutral-400">{formatTime(duration)}</div>
            </div>
          </div>
        )}
      </div>

      {/* cleanup and audio lifecycle */}
      <audio
        ref={(el) => {
          if (el) audioRef.current = el;
        }}
        style={{ display: 'none' }}
      />
    </>
  );
};

function formatTime(seconds: number) {
  if (!seconds || seconds <= 0 || Number.isNaN(seconds)) return '0:00';
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  const m = Math.floor(seconds / 60).toString();
  return `${m}:${s}`;
}

export default MusicPlayer;
