
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Default from '../Layouts/Default';
import BlogLayout from '../Layouts/BlogLayout';

import Home from '../Views/Home';
import Blog from '../Views/Blog';

export default function Web() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home uses the Default layout */}
        <Route
          path="/"
          element={
            <Default>
              <Home />
            </Default>
          }
        />

        {/* Blog uses the Blog layout */}
        <Route
          path="/blog"
          element={
            <BlogLayout>
              <Blog />
            </BlogLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
