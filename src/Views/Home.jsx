import { useEffect, useState } from 'react';
import { apiGet } from '../Assets/ApiRequest';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [homeCount, setHomeCount] = useState(0);

  useEffect(() => {
    apiGet('/blogs/posts')
      .then((result) => {
        setPosts(result.responseData);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ padding: '30px', fontFamily: 'Arial' }}>
      <p>Blog posts loaded from the LifeTechOCMS backend.</p>

      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {posts.map((post) => (
        <article
          key={post.ltId}
          style={{
            border: '1px solid #ddd',
            padding: '20px',
            marginBottom: '15px',
            borderRadius: '8px'
          }}
        >
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <small>Status: {post.status}</small>
        </article>
      ))}

      <div>
        <h3>Home State Test</h3>

        <button onClick={() => setHomeCount(count => count + 1)}>
          Home Count: {homeCount}
        </button>
      </div>

    </main>
  );
}