# API Request Utility – Developer Guide

This guide explains the shared API request utility used by **ThemeLtReactKit** to fetch data from a LifeTechOCMS backend, including the **MdBlog** module. It applies to both standalone React/Vite development and exported LifeTechOCMS themes.

## Purpose and when to use

Use `apiGet(endpoint)` when a React View or Component needs to send a **GET** request to a LifeTechOCMS API endpoint. The utility selects a backend URL, optionally includes a bearer token, requests JSON, checks both the HTTP status and the LifeTechOCMS response category, and returns the parsed response.

The current implementation supports GET requests only. It does not implement POST, UPDATE, DELETE, token refresh, or automatic login redirects.

## Source code

The utility is located at `src/Assets/ApiRequest.js` in the current project structure.

```javascript
const getApiBaseUrl = () => {
  return (
    window.LT_CONFIG?.baseUrl ||
    import.meta.env.VITE_API_BASE_URL ||
    '/backend'
  ).replace(/\/+$/, '');
};

export async function apiGet(endpoint) {
  const baseUrl = getApiBaseUrl();

  const path = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  const token = window.LT_CONFIG?.token;

  const headers = {
    Accept: 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${baseUrl}${path}`,
    {
      method: 'GET',
      headers
    }
  );

  if (!response.ok) {
    throw new Error(
      `HTTP error: ${response.status}`
    );
  }

  const result = await response.json();

  if (String(result.responseCategory) !== '200') {
    throw new Error(
      result.responseResult ||
      'LifeTechOCMS API request failed'
    );
  }

  return result;
}
```

## Backend URL selection

`getApiBaseUrl()` uses the first non-empty value in this order:

1. `window.LT_CONFIG.baseUrl` — runtime configuration, useful in exported LifeTechOCMS themes.
2. `import.meta.env.VITE_API_BASE_URL` — Vite environment configuration.
3. `/backend` — default development proxy path.

Trailing `/` characters are removed from the selected base URL. The endpoint is then prefixed with `/` if necessary.

For example, `apiGet('/blogs/posts')` requests `${baseUrl}/blogs/posts`.

### Standalone development: `.env.development`

When using the included Vite development proxy, set:

```env
VITE_API_BASE_URL=/backend
```

Review the `server.proxy` section in `vite.config.js`:

```javascript
server: {
  port: 5173,
  proxy: {
    '/backend': {
      target: 'http://localhost',
      changeOrigin: true,
      rewrite: path =>
        path.replace(/^\/backend/, '/projects/api/v1/v2')
    }
  }
}
```

With this configuration, a request to `/backend/blogs/posts` from the Vite development server is forwarded to `http://localhost/projects/api/v1/v2/blogs/posts`.

If the backend runs on another port, change `target`, for example to `http://localhost:8080`. If the backend uses another API path, update `rewrite` accordingly. Restart the Vite server after changing its configuration.

**Note:** Vite's development proxy does not operate in production builds.

### Production build: `.env.production`

Set the backend API path or URL to match your deployment:

```env
VITE_API_BASE_URL=/projects/api/v1/v2
```

Alternatively, for a separate backend host:

```env
VITE_API_BASE_URL=https://example.com/api/v1/v2
```

The relative path works only if the deployed website serves that API path on the same origin. A separate backend host must allow the frontend origin through its CORS configuration. Rebuild or re-export after changing Vite environment variables.

### Exported LifeTechOCMS theme: runtime configuration

When the host page provides `window.LT_CONFIG`, its `baseUrl` takes precedence over the Vite environment value:

```html
<script>
  window.LT_CONFIG = {
    baseUrl: '/api/v1/v2'
  };
</script>
```

The host page must define this configuration **before** the compiled React JavaScript runs. An optional `token` field is read by the utility when available; it is not required for anonymous/public API calls.

## Request headers and authentication

Every request includes:

```http
Accept: application/json
```

If `window.LT_CONFIG.token` contains a truthy value, the utility also sends:

```http
Authorization: Bearer <token>
```

The utility does **not** retrieve a token from `.env.production`, local storage, or cookies, and it does not refresh expired tokens. Never place secrets or private authentication credentials in `VITE_` environment variables: Vite exposes them to browser code. A browser-accessible token must be treated as sensitive and supplied only through an appropriate authentication design.

## Practical MdBlog example

Use the helper in a React View to fetch blog posts:

```jsx
import { useEffect, useState } from 'react';
import { apiGet } from '../Assets/ApiRequest';

export default function Blog() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    apiGet('/blogs/posts')
      .then(result => {
        if (active) setResponse(result);
      })
      .catch(err => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  if (loading) return <p>Loading blog posts...</p>;
  if (error) return <p>Unable to load posts: {error}</p>;

  // Inspect response.responseData and map it to the actual
  // MdBlog endpoint payload before rendering individual posts.
  return <pre>{JSON.stringify(response?.responseData, null, 2)}</pre>;
}
```

This example intentionally displays `responseData` without assuming its shape. The actual MdBlog response may be an array, a paginated object, or another structure depending on the endpoint implementation.

## Response handling

The utility performs two independent checks:

| Check | Condition | Outcome |
| --- | --- | --- |
| HTTP status | `response.ok` is `false` | Throws `HTTP error: <status>` |
| LifeTechOCMS response | `String(responseCategory) !== '200'` | Throws `responseResult` or a generic error |
| Both checks pass | HTTP success and category `200` | Returns the complete parsed JSON response |

A typical successful response is expected to use the LifeTechOCMS response fields:

```json
{
  "responseResult": "Success",
  "responseCode": "1000",
  "responseCategory": "200",
  "responseData": []
}
```

The example above is illustrative; the actual response code and data depend on the endpoint. LifeTechOCMS uses **four-digit response codes**, while this helper checks **responseCategory**, not responseCode.

### Error handling in Views

Always call `apiGet()` with `try/catch` or `.catch()` and display a useful message. Network errors, invalid JSON, HTTP errors, and unsuccessful LifeTechOCMS responses can all reject the returned promise.

## Developer conventions

- Import the shared utility instead of duplicating `fetch()` configuration across Views.
- Pass API endpoints such as `/blogs/posts`, not the complete backend URL, so configuration remains portable.
- Keep React Views independent of the backend host address.
- Use `responseData` according to the specific API endpoint's documented structure.
- Test public endpoints without a token and protected endpoints with the appropriate authentication setup.
- Test both `npm run dev` and the exported LifeTechOCMS theme; the development proxy is not available after export.
- Document new Views and their API usage in a corresponding Markdown file under `docs/`.

## Test checklist

- [ ] The standalone React application loads MdBlog data using `/backend` and the Vite proxy.
- [ ] A backend running on a custom port works after updating `target`.
- [ ] The production build reaches the configured backend API.
- [ ] The exported theme uses the expected `window.LT_CONFIG.baseUrl` when present.
- [ ] Public API requests work without an Authorization header.
- [ ] Protected requests include the bearer token when configured.
- [ ] HTTP and LifeTechOCMS API failures display appropriate errors.

## Related resources

- [ThemeLtReactKit repository](https://github.com/ajayi-abolore/ThemeLtReactKit)
- [LifeTechOCMS framework](https://github.com/lifetechOCMS/lifetechocms)
- [@lifetechocms/react on npm](https://www.npmjs.com/package/@lifetechocms/react)
- [Contribution guidelines](../CONTRIBUTING.md)

---

[Back to project README](../README.md)
