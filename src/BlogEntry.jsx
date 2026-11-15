import { createRoot } from 'react-dom/client';

import BlogLayout from './Layouts/BlogLayout';
import LifeTechDynamicContent from './Components/LifeTechDynamicContent';

const blogroot = document.getElementById('blog-layout');

if (blogroot) {
  createRoot(blogroot).render(
    <BlogLayout>
      <LifeTechDynamicContent />
    </BlogLayout>
  );
}else{
    console.log("Unable to read any file");
}