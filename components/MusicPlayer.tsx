import React, { useState, useRef } from 'react';
import { Play, Pause, Music } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className="w-full max-w-2xl mt-8 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
       <audio 
         ref={audioRef} 
         src="/Ishq Jalakar Dhurandhar 320 Kbps.mp3" 
         onEnded={() => setIsPlaying(false)}
         onTimeUpdate={handleTimeUpdate}
         onLoadedMetadata={handleLoadedMetadata}
       />
       
       <div className="flex items-center gap-4">
         {/* Album Art */}
         <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 shadow-inner">
           <img 
              src="/ishq-jalakar-dhurandhar-500-500.jpg" 
              alt="Ishq Jalakar" 
              className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'group-hover:scale-105'}`}
           />
           {/* Spinning vinyl effect overlay */}
           <div className="absolute inset-0 bg-black/10 dark:bg-white/5 rounded-lg pointer-events-none"></div>
         </div>
         
         {/* Content */}
         <div className="flex-1 min-w-0 flex flex-col justify-center h-full gap-1">
         <div className="flex items-center gap-1.5 mb-0.5">
            <img src="/AppleMusicicon.png" alt="Apple Music" className="w-4 h-4 object-contain" />
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Last played</span>
         </div>
           <h3 className="text-base font-semibold text-neutral-900 dark:text-white truncate">
             Ishq Jalakar - Karvaan
           </h3>
           <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
             (From "Dhurandhar")
           </p>
         </div>

         {/* Play Button */}
         <button 
           onClick={togglePlay}
           className="mr-2 flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-[#FA243C] hover:text-white transition-colors duration-300 focus:outline-none"
         >
            {isPlaying ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" className="ml-0.5" />
            )}
         </button>
       </div>

       {/* Progress Bar */}
       <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isPlaying ? 'max-h-20 opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'}`}>
          <div className="flex items-center gap-3 px-1">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 w-8 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full group/slider cursor-pointer">
               <input
                 type="range"
                 min={0}
                 max={duration || 100}
                 value={currentTime}
                 onChange={handleSeek}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <div
                 className="absolute top-0 left-0 h-full bg-[#FA243C] rounded-full"
                 style={{ width: `${(currentTime / duration) * 100}%` }}
               />
               <div
                 className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-[#FA243C] rounded-full shadow-sm opacity-0 group-hover/slider:opacity-100 transition-opacity pointer-events-none"
                 style={{ left: `${(currentTime / duration) * 100}%`, marginLeft: '-5px' }}
               />
            </div>
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 w-8 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
       </div>
    </div>
  );
};

export default MusicPlayer;
