import React from 'react';
import { ArrowRight } from 'lucide-react';

const FeaturedBlog = () => {
  return (
    <section className="max-w-3xl mx-auto px-4 mb-20">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-neutral-500 mb-1">Featured</h3>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Blogs</h2>
      </div>

      <a 
        href="https://medium.com/@pranavgawai1518/from-ideas-to-impact-my-experience-at-the-smart-india-hackathon-34831673024d"
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
          {/* Image Cover */}
          <div className="h-48 w-full relative overflow-hidden">
             <img 
               src="/blogsih2024.png" 
               alt="Smart India Hackathon" 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              From Ideas to Impact: My Experience at the Smart India Hackathon
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
              Hackathons like the Smart India Hackathon (SIH) are more than just competitions — they’re experiences that challenge you to think creatively, collaborate, and solve real-world problems in a limited time.
            </p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                  Hackathon
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                  Engineering
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span>Sep 22, 2024</span>
                <div className="flex items-center gap-1 text-neutral-900 dark:text-white font-medium group-hover:translate-x-1 transition-transform">
                  Read More <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </section>
  );
};

export default FeaturedBlog;
