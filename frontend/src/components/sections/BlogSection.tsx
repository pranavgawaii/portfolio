import React from 'react';
import { BLOGS, BlogPost } from '../../config/constants';
import { ArrowRight } from 'lucide-react';
import { useNav } from '../../App';

const BlogSection: React.FC = () => {
  const { openBlog } = useNav();

  const handleClick = (blog: BlogPost) => {
    if (blog.isLocal) {
      openBlog(blog);
    } else if (blog.link) {
      window.open(blog.link, '_blank');
    }
  };

  return (
    <div className="space-y-0 divide-y divide-border-light dark:divide-border-dark">
      {BLOGS.slice(0, 3).map(blog => (
        <button
          key={blog.id}
          onClick={() => handleClick(blog)}
          className="group w-full flex items-start justify-between gap-4 py-5 hover:opacity-80 transition-opacity text-left"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-sans font-semibold text-base text-text-light dark:text-text-dark leading-snug mb-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
              {blog.title}
            </h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark line-clamp-1 mb-2">
              {blog.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-text-muted-light dark:text-text-muted-dark opacity-60">
              <span>{blog.date}</span>
              <span>·</span>
              <span>{blog.platform}</span>
            </div>
          </div>
          <div className="shrink-0 mt-1 text-text-muted-light dark:text-text-muted-dark group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
            <ArrowRight size={16} />
          </div>
        </button>
      ))}

    </div>
  );
};

export default BlogSection;
