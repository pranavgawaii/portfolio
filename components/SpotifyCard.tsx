
import React, { useEffect, useState, useRef } from 'react';
import { Play, AudioLines } from 'lucide-react';

interface SpotifyTrack {
    albumImageUrl: string;
    artist: string;
    isPlaying: boolean;
    songUrl: string;
    title: string;
}

const SpotifyCard: React.FC = () => {
    // Default mock track (Khuda Jaane) as fallback
    const mockTrack = {
        albumImageUrl: "https://i.scdn.co/image/ab67616d0000b2732b1a92144dd52d9a941e2d45",
        artist: "Vishal-Shekhar, KK, Shilpa Rao, Anvita Dutt Guptan",
        isPlaying: false,
        songUrl: "https://open.spotify.com/track/4gbVRS8gloEluzf0GzDOFc",
        title: "Khuda Jaane",
        previewUrl: null, // No preview for mock
        progressMs: 0,
        durationMs: 0
    };

    // Initial state is null to prevent FOUC (Flash of Unstyled Content) or wrong data
    const [track, setTrack] = useState<SpotifyTrack & { previewUrl?: string | null; progressMs?: number; durationMs?: number } | null>(null);
    const [imageError, setImageError] = useState(false); // Track image load error
    const [loading, setLoading] = useState(true);
    const [isLocalPlaying, setIsLocalPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Reset image error when track changes
    useEffect(() => {
        setImageError(false);
    }, [track?.albumImageUrl]);

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const res = await fetch(`/api/spotify/now-playing?t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && (data.isPlaying || data.title)) {
                        setTrack({
                            albumImageUrl: data.albumImageUrl || mockTrack.albumImageUrl,
                            artist: data.artist || mockTrack.artist,
                            isPlaying: !!data.isPlaying,
                            songUrl: data.songUrl || mockTrack.songUrl,
                            title: data.title || mockTrack.title,
                            previewUrl: data.previewUrl,
                            progressMs: data.progressMs || 0,
                            durationMs: data.durationMs || 0
                        });
                    } else {
                        // Fallback if API returns empty - might want to keep previous state or null
                        // For now, if API fails or empty, we persist whatever we have or null if first load
                        if (!track) setTrack(mockTrack);
                    }
                } else {
                    if (!track) setTrack(mockTrack);
                }
            } catch (e) {
                console.error("Spotify fetch failed, using mock:", e);
                if (!track) setTrack(mockTrack);
            }
            setLoading(false);
        };

        fetchTrack();
        const interval = setInterval(fetchTrack, 5000);
        return () => clearInterval(interval);
    }, []);

    // Handle Audio Playback
    const togglePlay = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link click
        e.stopPropagation();

        if (!track.previewUrl) return;

        if (isLocalPlaying) {
            audioRef.current?.pause();
            setIsLocalPlaying(false);
        } else {
            audioRef.current?.play();
            setIsLocalPlaying(true);
        }
    };

    const handleAudioEnded = () => {
        setIsLocalPlaying(false);
    };

    const formatTime = (ms: number) => {
        if (!ms) return '0:00';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progressPercent = track?.durationMs ? (track.progressMs! / track.durationMs) * 100 : 0;

    if (loading && !track) return null; // Or return a Skeleton component
    if (!track) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <audio ref={audioRef} src={track.previewUrl || ''} onEnded={handleAudioEnded} />

            <a
                href={track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative bg-white dark:bg-[#181818] hover:bg-neutral-50 dark:hover:bg-[#202020] transition-colors duration-300 border border-neutral-200 dark:border-[#282828] rounded-xl p-3 md:p-4 overflow-hidden shadow-sm dark:shadow-none"
            >
                <div className="flex items-center gap-4 z-10 relative">
                    {/* Album Art */}
                    <div className="relative shrink-0">
                        <img
                            src={imageError ? mockTrack.albumImageUrl : track.albumImageUrl}
                            alt={track.title}
                            onError={() => setImageError(true)}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-lg group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                                alt="Spotify"
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-bold text-[#1DB954] tracking-wide">
                                {track.isPlaying ? 'Listening Now 🎧' : 'Last played'}
                            </span>
                        </div>

                        <h3 className="text-neutral-900 dark:text-white font-bold text-base md:text-lg truncate leading-tight mb-1 group-hover:underline decoration-neutral-400/50 underline-offset-2 transition-all">
                            {track.title}
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm truncate">
                            by {track.artist}
                        </p>
                    </div>

                    {/* Play/Status Icon */}
                    <div className="shrink-0 mr-2 z-20">
                        <button
                            onClick={togglePlay}
                            disabled={!track.previewUrl}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isLocalPlaying ? 'bg-[#1DB954] text-white' : 'bg-neutral-100 dark:bg-transparent text-neutral-400 dark:text-neutral-500 group-hover:text-[#1DB954]'}`}
                        >
                            {isLocalPlaying ? (
                                <AudioLines size={20} className="animate-pulse" />
                            ) : track.isPlaying ? (
                                <AudioLines size={24} className="animate-pulse" />
                            ) : (
                                <Play size={24} fill="currentColor" className={!track.previewUrl ? 'opacity-50' : ''} />
                            )}
                        </button>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default SpotifyCard;
