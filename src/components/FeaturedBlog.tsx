import React from 'react';
import Section from './Section';
import PremiumBlogStack from './ui/premium-blog-stack';

const FeaturedBlog = () => {
  return (
    <Section id="blogs" title="Thought Leadership">
      <PremiumBlogStack />
    </Section>
  );
};

export default FeaturedBlog;
