import React from 'react';
import AnimatedCardStack from './ui/animated-card-stack';

const FeaturedBlog = () => {
  return (
    <section id="blogs" className="max-w-4xl mx-auto px-4 mb-20">
      <div className="mb-6 text-left">
        <h3 className="text-sm font-medium text-neutral-500 mb-1">Featured</h3>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Blogs</h2>
      </div>

      <AnimatedCardStack />
    </section>
  );
};

export default FeaturedBlog;
