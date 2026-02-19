
import React, { useEffect, useState, useRef } from 'react';
import { Play, AudioLines } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BorderTrail } from './ui/border-trail';

interface SpotifyTrack {
    albumImageUrl: string;
    artist: string;
    isPlaying: boolean;
    songUrl: string;
    title: string;
}

const SpotifyCard: React.FC = () => {
    const mockTrack = {
        albumImageUrl: "https://i.scdn.co/image/ab67616d0000b2732b1a92144dd52d9a941e2d45",
        artist: "Vishal-Shekhar, KK, Shilpa Rao, Anvita Dutt Guptan",
        isPlaying: false,
        songUrl: "https://open.spotify.com/track/4gbVRS8gloEluzf0GzDOFc",
        title: "Khuda Jaane",
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
                            durationMs: data.durationMs || 0
                        }));
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
                className="group relative flex items-center gap-4 p-3 rounded-2xl border border-border-light dark:border-border-dark bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:bg-gray-50/80 dark:hover:bg-white/10 transition-all duration-300 shadow-sm hover:shadow-md"
            >
                {/* Border Animation - Triggered by either local play or Spotify "Now Playing" */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <AnimatePresence>
                        {(isLocalPlaying || track.isPlaying) && (
                            <BorderTrail
                                className="bg-[#1DB954] z-[100]"
                                size={120}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden shadow-sm z-20">
                    <img
                        src={imageError ? mockTrack.albumImageUrl : track.albumImageUrl}
                        alt={track.title}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {track.isPlaying && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <AudioLines size={18} className="text-white animate-bounce" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 z-20">
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${track.isPlaying ? 'bg-[#1DB954] animate-pulse' : 'bg-gray-400'}`} />
                        <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                            {track.isPlaying ? 'Now Playing' : 'Last Played — Offline'}
                        </span>
                    </div>
                    <h3 className="text-sm font-semibold text-text-light dark:text-text-dark truncate leading-tight mb-0.5">
                        {track.title}
                    </h3>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
                        {track.artist}
                    </p>
                </div>

                <div className="shrink-0 flex items-center gap-3 z-20">
                    <button
                        onClick={togglePlay}
                        disabled={!track.previewUrl}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all border ${isLocalPlaying
                            ? 'bg-[#1DB954] text-white border-[#1DB954] shadow-lg scale-110'
                            : 'bg-white dark:bg-neutral-800 border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:border-[#1DB954] hover:text-[#1DB954]'
                            }`}
                    >
                        {isLocalPlaying ? (
                            <AudioLines size={16} />
                        ) : (
                            <Play size={16} fill={track.previewUrl ? "currentColor" : "none"} className={!track.previewUrl ? 'opacity-20' : ''} />
                        )}
                    </button>
                </div>
            </a>
        </div>
    );
};

export default SpotifyCard;
