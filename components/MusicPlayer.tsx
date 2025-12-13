import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

const MusicPlayer = () => {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrack() {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/spotify/last-played');
      const data = await res.json();
      setTrack(data);
      setLoading(false);
    }
    fetchTrack();
  }, []);

  if (loading || !track) return (
    <div className="w-full max-w-2xl mt-8 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm flex items-center gap-4 animate-pulse">
      <div className="w-20 h-20 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
      </div>
    </div>
  );

  const { track: song } = track;
  const album = song.album;
  const artists = song.artists.map((a: any) => a.name).join(', ');

  return (
    <div className="w-full max-w-2xl mt-8 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-4">
        {/* Album Art */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 shadow-inner">
          <img 
            src={album.images[0]?.url} 
            alt={song.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 dark:bg-white/5 rounded-lg pointer-events-none"></div>
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center h-full gap-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <img src="/spotify-icon.png" alt="Spotify" className="w-4 h-4 object-contain" />
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Last played</span>
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white truncate">
            {song.name}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
            {artists}
          </p>
        </div>
        {/* Spotify Link Button */}
        <a 
          href={song.external_urls.spotify} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mr-2 flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-300 focus:outline-none"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default MusicPlayer;
