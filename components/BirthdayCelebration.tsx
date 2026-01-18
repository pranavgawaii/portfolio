import React, { useState } from 'react';
import { Gift } from 'lucide-react';

const BirthdayCelebration: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [wished, setWished] = useState(false);

    const triggerAnimation = () => {
        if (isPlaying) return;
        setIsPlaying(true);

        // Play subtle pop sound
        try {
            const audio = new Audio('/pop.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play failed:', e));
        } catch (error) {
            console.warn("Audio setup failed", error);
        }

        // Show Guestbook Modal after 2.5 seconds
        setTimeout(() => {
            if (!wished) setShowModal(true);
        }, 2500);

        // Animation: 8s linear flow + 1.5s stagger + buffer = 10s
        setTimeout(() => {
            setIsPlaying(false);
        }, 10000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        // TODO: Connect to backend
        console.log('Wish recorded from:', name);

        setWished(true);
        setShowModal(false);
    };

    const line1 = "happy".split('');
    const line2 = "birthday".split('');

    return (
        <>
            <button
                onClick={triggerAnimation}
                disabled={isPlaying}
                className="fixed top-24 right-6 z-[100] p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:scale-110 hover:bg-white/20 transition-all duration-300 group disabled:opacity-0 disabled:pointer-events-none"
                aria-label="Celebrate birthday"
            >
                <Gift
                    size={24}
                    className="text-pink-400 group-hover:text-pink-300 transition-colors animate-pulse"
                />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Surprise!
                </span>
            </button>

            {/* Guestbook Modal */}
            {showModal && (
                <div className="fixed top-36 right-6 z-[101] animate-in fade-in slide-in-from-right-10 duration-500">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-64 flex flex-col gap-3"
                    >
                        <p className="text-white/90 text-sm font-medium ml-1">Example: "Best wishes!"</p>
                        <input
                            type="text"
                            placeholder="Wish by..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-pink-400/50 placeholder:text-white/30"
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="text-xs text-white/50 hover:text-white px-2 py-1 transition-colors"
                            >
                                Later
                            </button>
                            <button
                                type="submit"
                                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition-all font-medium"
                            >
                                Send Wish
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Animation Overlay */}
            <div className={`birthday-overlay ${isPlaying ? 'active' : ''}`}>
                {isPlaying && (
                    <div className="birthday-container">
                        <div className="birthday-line">
                            {line1.map((char, index) => (
                                <span
                                    key={`l1-${index}`}
                                    className="letter"
                                    style={{ '--delay': index } as React.CSSProperties}
                                    data-letter={char}
                                >
                                    {char}
                                </span>
                            ))}
                        </div>

                        <div className="birthday-line">
                            {line2.map((char, index) => (
                                <span
                                    key={`l2-${index}`}
                                    className="letter"
                                    style={{ '--delay': index + 5 } as React.CSSProperties}
                                    data-letter={char}
                                >
                                    {char}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default BirthdayCelebration;
