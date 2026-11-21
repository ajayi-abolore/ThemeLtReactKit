import { useState } from 'react';

export default function Blog() {
  const [blogCount, setBlogCount] = useState(0);

  return (
    <div>
      <h1>LifeTechOCMS Blog</h1>

      <p>
        Welcome to the Blog View.
      </p> 
        <div>
          <h3>Blog State Test</h3>

          <button onClick={() => setBlogCount(count => count + 1)}>
            Blog Count: {blogCount}
          </button>
        </div>
      <p>
        This View is rendered using React Router.
      </p>
    </div>
  );
}
