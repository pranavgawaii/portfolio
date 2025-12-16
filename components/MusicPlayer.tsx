
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Music, Play, X, Pause } from 'lucide-react';

const MusicPlayer = () => {
  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || (!resolvedTheme && document.documentElement.classList.contains('dark'));

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
        if (data && (data.title || data.artist)) {
          setTrack(data);
          try { localStorage.setItem('lastPlayedTrack', JSON.stringify(data)); } catch(e) {}
        }
      } catch (e) {
        // ignore network errors
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 5000);
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
    const onPause = () => {
      setIsPreviewPlaying(false);
      setExpanded(false);
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
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

  // Theme-aware classes
  const cardBase = 'w-full max-w-2xl mt-8 rounded-2xl p-4 shadow-sm flex items-center gap-4';
  const cardThemeClass = isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white border border-neutral-200';
  const titleClass = isDark ? 'text-lg font-bold text-white truncate' : 'text-lg font-bold text-neutral-900 truncate';
  const artistClass = isDark ? 'text-sm text-neutral-400 truncate' : 'text-sm text-neutral-600 truncate';
  const btnClass = isDark ? 'flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-800 hover:bg-green-600 transition-colors group' : 'flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100 hover:bg-green-600 transition-colors group';
  const iconClass = `${isDark ? 'text-white' : 'text-neutral-900'} group-hover:text-white w-5 h-5`;
  const modalThemeClass = isDark ? 'bg-neutral-900' : 'bg-white';
  const albumBgClass = isDark ? 'bg-neutral-800' : 'bg-neutral-100';
  const closeBtnClass = isDark ? 'p-2 rounded-md bg-neutral-800 hover:bg-neutral-700' : 'p-2 rounded-md bg-neutral-100 hover:bg-neutral-200';
  const expandedBgClass = isDark ? 'bg-neutral-900' : 'bg-white';
  const expandedBorderClass = isDark ? 'border border-neutral-800' : 'border border-neutral-200';
  const expandedTitleClass = isDark ? 'text-sm font-semibold text-white' : 'text-sm font-semibold text-neutral-900';
  const expandedArtistClass = isDark ? 'text-xs text-neutral-400' : 'text-xs text-neutral-600';
  const timeTextClass = isDark ? 'text-xs text-neutral-400' : 'text-xs text-neutral-600';
  const rangeBgClass = isDark ? 'bg-neutral-700' : 'bg-neutral-200';

  // Always render the player card. If still loading and no cached track, show minimal placeholder.
  const display = track || { isPlaying: false, title: 'No recent tracks', artist: 'Start playing music on Spotify!', albumImageUrl: null };

  const percentFilled = duration && duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const fillColor = '#10B981'; // Tailwind green-500
  const darkTrackColor = '#374151'; // neutral-700
  const lightTrackColor = '#E5E7EB'; // neutral-200
  const trackColor = isDark ? darkTrackColor : lightTrackColor;

  return (
    <>
      <div className={`${cardBase} ${cardThemeClass}`} style={{minHeight: 88}}>
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
          <img src="/spotify.png" alt="Spotify" className="w-5 h-5 object-contain" />
            <span className="text-sm font-medium text-green-400">
            {display.isPlaying ? 'Listening now 🎧' : 'Last played'}
          </span>
        </div>
        <div className={titleClass}>
          <a
            href={display.songUrl || (display.trackId ? `https://open.spotify.com/track/${display.trackId}` : '#')}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {display.title}
          </a>
        </div>
        <div className={artistClass}>
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
              className={btnClass}
              title={isPreviewPlaying ? 'Pause preview' : 'Play preview'}
            >
              {isPreviewPlaying ? (
                <X className={iconClass} />
              ) : (
                <Play className={iconClass} />
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                const url = display.songUrl || (display.trackId ? `https://open.spotify.com/track/${display.trackId}` : undefined);
                if (url) window.open(url, '_blank', 'noopener');
              }}
              className={btnClass}
              title="Open on Spotify"
            >
              <Play className={iconClass} />
            </button>
          )}
        </div>
      )}
      </div>

      
      {/* Animated expanded player */}
      <div
        className={`w-full max-w-2xl mt-4 ${expandedBgClass} rounded-2xl overflow-hidden origin-top transform-gpu transition-all ease-out duration-300 ${expanded ? `${expandedBorderClass} max-h-72 p-4 opacity-100 translate-y-0` : 'max-h-0 p-0 opacity-0 -translate-y-2'}`}
        aria-hidden={!expanded}
      >
        {expanded && (
          <div className="py-1">
            <div className="flex items-center gap-3">
              <div className={timeTextClass}>{formatTime(currentTime)}</div>
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
                style={{
                  background: `linear-gradient(90deg, ${fillColor} ${percentFilled}%, ${trackColor} ${percentFilled}%)`,
                  accentColor: fillColor,
                }}
                className={`music-range flex-1 h-1 rounded-full appearance-none`}
              />
              <div className={timeTextClass}>{formatTime(duration)}</div>
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
