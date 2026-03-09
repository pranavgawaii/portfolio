
import React, { useEffect, useState, useRef } from 'react';
import { Play, AudioLines } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BorderTrail } from '../ui/border-trail';

interface SpotifyTrack {
    albumImageUrl: string;
    artist: string;
    isPlaying: boolean;
    songUrl: string;
    title: string;
}

const SpotifyCard: React.FC = () => {
    const mockTrack = {
        albumImageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
        artist: "The Weeknd",
        isPlaying: false,
        songUrl: "https://open.spotify.com/track/7MXVBY9wcG4I4McZJZ9IuG",
        title: "Starboy",
        previewUrl: null,
        progressMs: 0,
        durationMs: 0
    };

    const [track, setTrack] = useState<SpotifyTrack & { previewUrl?: string | null; progressMs?: number; durationMs?: number } | null>(null);
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLocalPlaying, setIsLocalPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const res = await fetch(`/api/spotify/now-playing?t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && (data.isPlaying || data.title)) {
                        setTrack(prev => ({
                            albumImageUrl: data.albumImageUrl || prev?.albumImageUrl || mockTrack.albumImageUrl,
                            artist: data.artist || prev?.artist || mockTrack.artist,
                            isPlaying: !!data.isPlaying,
                            songUrl: data.songUrl || prev?.songUrl || mockTrack.songUrl,
                            title: data.title || prev?.title || mockTrack.title,
                            previewUrl: data.previewUrl,
                            progressMs: data.progressMs || 0,
                            durationMs: data.durationMs || 0,
                            isFallback: !!data.isFallback
                        } as any));
                    } else {
                        setTrack(prev => prev ? { ...prev, isPlaying: false } : mockTrack);
                    }
                } else {
                    setTrack(prev => prev ? { ...prev, isPlaying: false } : mockTrack);
                }
            } catch (e) {
                setTrack(prev => prev ? { ...prev, isPlaying: false } : mockTrack);
            }
            setLoading(false);
        };

        fetchTrack();
        const interval = setInterval(fetchTrack, 5000);
        return () => clearInterval(interval);
    }, []);

    const togglePlay = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!track?.previewUrl) return;
        if (isLocalPlaying) {
            audioRef.current?.pause();
            setIsLocalPlaying(false);
        } else {
            audioRef.current?.play();
            setIsLocalPlaying(true);
        }
    };

    if (loading && !track) return null;
    if (!track) return null;

    return (
        <div className="w-full mt-4">
            <audio ref={audioRef} src={track.previewUrl || ''} onEnded={() => setIsLocalPlaying(false)} />
            <a
                href={track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-4 p-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-0.5"
            >
                {/* Subtle Glow Effect */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#1DB954]/0 via-[#1DB954]/5 to-[#1DB954]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Border Animation - Triggered by either local play or Spotify "Now Playing" */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <AnimatePresence>
                        {(isLocalPlaying || track.isPlaying) && (
                            <BorderTrail
                                className="bg-[#1DB954] z-[100] blur-[1px]"
                                size={120}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-2xl z-20">
                    <img
                        src={imageError ? mockTrack.albumImageUrl : track.albumImageUrl}
                        alt=""
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 bg-neutral-900"
                    />
                    {track.isPlaying && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                            <AudioLines size={20} className="text-[#1DB954] animate-pulse" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 z-20 py-1">
                    <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${track.isPlaying ? 'bg-[#1DB954] shadow-[0_0_8px_#1DB954]' : 'bg-neutral-500'}`} />
                        <span className="text-[9px] font-bold font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.15em]">
                            {track.isPlaying ? 'Now Playing' : (track as any).isFallback ? 'Favorites — Offline' : 'Last Played — Offline'}
                        </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-neutral-900 dark:text-white truncate leading-tight group-hover:text-[#1DB954] transition-colors duration-300">
                        {track.title}
                    </h3>
                    <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        {track.artist}
                    </p>
                </div>

                <div className="shrink-0 flex items-center gap-3 z-20 pr-1">
                    <button
                        onClick={togglePlay}
                        disabled={!track.previewUrl}
                        className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${isLocalPlaying
                            ? 'bg-[#1DB954] text-white shadow-[0_0_20px_rgba(29,185,84,0.4)] scale-110'
                            : 'bg-neutral-100 dark:bg-white/5 text-neutral-400 hover:bg-[#1DB954]/10 hover:text-[#1DB954] hover:scale-105'
                            }`}
                    >
                        {isLocalPlaying ? (
                            <AudioLines size={18} />
                        ) : (
                            <Play size={18} fill={track.previewUrl ? "currentColor" : "none"} className={!track.previewUrl ? 'opacity-20' : ''} />
                        )}
                    </button>
                </div>
            </a>
        </div>
    );
};

export default SpotifyCard;
