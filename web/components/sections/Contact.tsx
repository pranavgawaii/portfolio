import React from 'react';
import { Mail } from 'lucide-react';

const Contact: React.FC = () => {
    return (
        <section id="contact" className="mt-16 sm:mt-24 mb-8 sm:mb-12 flex justify-center items-center">
            <div className="w-full rounded-2xl border border-border-light dark:border-border-dark bg-white/50 dark:bg-white/5 backdrop-blur-md px-4 sm:px-6 py-12 sm:py-16 text-center shadow-sm">
                <h2 className="font-display text-3xl sm:text-4xl text-text-light dark:text-text-dark mb-3 sm:mb-4">Get In Touch</h2>
                <p className="text-text-muted-light dark:text-text-muted-dark mb-6 sm:mb-8 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed">
                    If you’ve made it this far, we should talk :)<br />
                    I’m open to Work, Collaborations, & Interesting problems.<br />
                    Have a question or an idea? My inbox is always open.
                </p>
                <a
                    href="https://x.com/messages/compose?recipient_id=pranavgawai_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-3 bg-text-light dark:bg-text-dark text-background-light dark:text-background-dark rounded-full text-sm font-semibold hover:scale-105 transition-transform active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                >
                    <Mail size={16} />
                    Say Hello
                </a>
            </div>
        </section>
    );
};

export default Contact;
