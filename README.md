# ThemeLtReactKit

[![GitHub Stars](https://img.shields.io/github/stars/ajayi-abolore/ThemeLtReactKit)](https://github.com/ajayi-abolore/ThemeLtReactKit/stargazers) [![GitHub Issues](https://img.shields.io/github/issues/ajayi-abolore/ThemeLtReactKit)](https://github.com/ajayi-abolore/ThemeLtReactKit/issues) [![npm Version](https://img.shields.io/npm/v/@lifetechocms/react)](https://www.npmjs.com/package/@lifetechocms/react)

**An open-source reference React application for developing and exporting [LifeTechOCMS](https://github.com/lifetechOCMS/lifetechocms) themes.**

ThemeLtReactKit is our first practical test project for defining conventions that future React theme developers can follow. It uses **React, Vite, and the [`@lifetechocms/react`](https://www.npmjs.com/package/@lifetechocms/react) plugin**, with the **MdBlog** module as the LifeTechOCMS backend for integration testing.

The application is designed to work in **two modes**: as a standalone React application during development, and as an exported theme installed in LifeTechOCMS. Both modes should reuse the same React components wherever possible.

> **Status: Active development / experimental.** This repository is a test bed for discovering and documenting conventions. Some cross-module content and layout behaviors are still being validated; exported themes should be tested in LifeTechOCMS before production use.

## Goals

- Build a practical React application that runs independently with Vite.
- Export React Layouts and Views into a LifeTechOCMS-compatible theme.
- Use MdBlog APIs to test real module-backed content.
- Explore dynamic page content, layout assignments, navigation, and role-based access.
- Establish repeatable conventions for React theme developers.
- Encourage open-source testing, improvements, and contributions.

LifeTechOCMS is a PHP-based modular framework with role-based access control (RBAC). Its backend manages menus, pages, and content according to user roles and permissions, including the **anonymous** role for visitors who are not logged in. Frontend visibility is not a replacement for backend authorization.

## Two Development Modes

| Mode | Purpose | Command / workflow |
|---|---|---|
| Standalone React | Develop and test React routes, components, and MdBlog API integration | `npm run dev` |
| LifeTechOCMS theme | Compile and export the application into LifeTechOCMS Layouts, Views, and Assets | `npm run lt-export` |

The standalone application uses React Router. When exported, LifeTechOCMS manages its own pages, menu navigation, layout assignment, and dynamic content. Route behavior and module rendering must be verified in **both** environments.

## Getting Started

Requirements: a compatible Node.js installation, npm, and access to a running LifeTechOCMS installation with MdBlog for backend integration tests. Check the Vite version's Node.js requirements before installing.

```bash
git clone https://github.com/ajayi-abolore/ThemeLtReactKit.git
cd ThemeLtReactKit
npm install
npm run dev
```

Open the local address printed by Vite (the current configuration uses port `5173`). On Windows PowerShell, `npm.cmd` may be used instead of `npm` when script execution is restricted.

### Backend API Configuration

ThemeLtReactKit uses the **MdBlog** module through the LifeTechOCMS backend API. Developers should configure the backend address for their own installation rather than hardcoding it in React components.

#### Production API URL — `.env.production`

Open the `.env.production` file in the project root and update:

```env
VITE_API_BASE_URL=/projects/api/v1/v2
```

Replace the value with the actual API path or full URL for your LifeTechOCMS backend. For example, a backend hosted at a different domain could use:

```env
VITE_API_BASE_URL=https://example.com/api/v1/v2
```

This setting is read by Vite for **production builds**, including the compiled application used for theme export. After editing `.env.production`, rebuild or re-export the application. If you use a different origin, the backend must allow the frontend origin through its CORS configuration. Do not put passwords, private tokens, or other secrets in `VITE_` variables: they are exposed to browser-side JavaScript.

#### Development API URL — `.env.development`

For standalone development using Vite's local proxy, set:

```env
VITE_API_BASE_URL=/backend
```

This lets frontend requests use `/backend` while Vite forwards them to your local LifeTechOCMS installation. `.env.development` applies to `npm run dev`; `.env.production` does **not** configure the development server.

#### Configure the Vite proxy — `vite.config.js`

Developers must also review the **`target`** and **`rewrite`** settings in `vite.config.js` to match the host, port, and API path of their backend:

```js
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

- `port: 5173` is the port for the **React/Vite development server**, not the LifeTechOCMS backend.
- `target` is the **backend host and port**. If the backend runs on a custom port, include it (for example, `http://localhost:8080`).
- `rewrite` maps the `/backend` prefix to the **real API path** used by that installation.

For example, when LifeTechOCMS runs at `http://localhost:8080` with its API under `/api/v1/v2`, use:

```js
server: {
  port: 5173,
  proxy: {
    '/backend': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: path =>
        path.replace(/^\/backend/, '/api/v1/v2')
    }
  }
}
```

With that configuration, a browser request to `http://localhost:5173/backend/blogs/posts` is proxied during development to `http://localhost:8080/api/v1/v2/blogs/posts`.

**Important:** Vite's `server.proxy` works only when the Vite development server is running. It does not become part of the production build or exported LifeTechOCMS theme. For production, `.env.production` must point to a browser-accessible API endpoint, or the hosting server must provide an equivalent proxy. Restart `npm run dev` after changing `vite.config.js`.

#### How API requests select the backend

The current API helper, `src/Assets/ApiRequest.js`, selects its base URL in this order:

1. `window.LT_CONFIG?.baseUrl` when supplied by the LifeTechOCMS runtime.
2. `VITE_API_BASE_URL` from the active Vite environment.
3. `/backend` as a fallback.

It sends `Accept: application/json`, adds a bearer token when one is supplied through the runtime configuration, and checks `responseCategory` for the LifeTechOCMS success category (`200`). Do not commit credentials or real tokens. Frontend authentication does not replace LifeTechOCMS backend RBAC enforcement.

## Project Structure

The uploaded development snapshot includes the following source layout:

```text
src/
├── Assets/
│   └── ApiRequest.js
├── Components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── LifeTechDynamicContent.jsx
├── Layouts/
│   ├── Default.jsx
│   └── BlogLayout.jsx
├── Routes/
│   └── Web.jsx
├── Views/
│   ├── Home.jsx
│   ├── Blog.jsx
│   └── Admin/
│       ├── DashboardAdmin.jsx
│       └── ReportAdmin.tsx
├── App.jsx
└── main.jsx
```

`Layouts` holds page shells; `Views` holds page content; `Components` holds reusable UI; `Routes` defines standalone React navigation; and `Assets` holds integration helpers. This is the **current test structure**, not yet a final framework-wide standard.

## Configure Theme Export

The current Vite integration uses:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import lifetechReact from '@lifetechocms/react/vite';

export default defineConfig({
  plugins: [
    react(),
    lifetechReact({
      themeName: 'ThemeLtReactTest',
      layoutsDirectory: 'src/Layouts',
      viewsDirectory: 'src/Views'
    })
  ],
  base: './'
});
```

- `themeName` is the name of the exported LifeTechOCMS theme.
- `layoutsDirectory` points to your React Layout components.
- `viewsDirectory` points to your React page/View components.

These paths are relative to the project root and can be changed to match your application. The complete repository configuration also includes the development API proxy shown above.

Export the theme:

```bash
npm run lt-export
```

The current test export uses `ThemeLtReactTest` as its theme name. Its generated structure includes `Layouts/`, `Views/`, `Assets/`, `Storage/Layouts/PendingLayouts.json`, and `lifetech-theme.json`. Generated files are build outputs; make changes in `src/` and export again rather than editing generated assets directly.

The exported theme must then be imported and tested in LifeTechOCMS. Exporting does **not** automatically publish it to the [LifeTechOCMS Theme Marketplace](https://www.lifetech.host/hubs/community/products?product=theme).

## MdBlog Integration and Testing

[MdBlog](https://github.com/lifetechOCMS/MdBlog) is the primary backend module used to establish practical conventions. Tests should cover retrieving blog content, handling API errors, React state and navigation, exporting layouts and views, and checking how module content renders inside a React layout.

A successful standalone React test is **not** sufficient evidence that the exported theme behaves identically. Contributors should report results separately for standalone mode and LifeTechOCMS mode.

## Development Conventions Under Evaluation

- React Layouts belong in the configured layouts directory; page Views belong in the configured views directory.
- Prefer reusable components rather than duplicating layout markup.
- Keep backend requests in a shared API layer; avoid hardcoded local URLs in components.
- Preserve backend role and permission enforcement; do not rely on frontend checks alone.
- Use `.jsx` or `.tsx` for React components and verify both standalone and exported behavior.
- Document any new convention through a tested example before treating it as established.

## Contributing and Community

**Help shape the first LifeTechOCMS React theme conventions.** Please [star this repository](https://github.com/ajayi-abolore/ThemeLtReactKit/stargazers), try the application, and share feedback.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a pull request. Report project-specific bugs and suggestions in [ThemeLtReactKit Issues](https://github.com/ajayi-abolore/ThemeLtReactKit/issues). For bugs in the npm exporter itself, use the [`@lifetechocms/react` issue tracker](https://github.com/ajayi-abolore/lifetechocms-react/issues).

## Related Projects

- [LifeTechOCMS framework](https://github.com/lifetechOCMS/lifetechocms)
- [LifeTechOCMS documentation](https://github.com/lifetechOCMS/docs)
- [`@lifetechocms/react` plugin](https://github.com/ajayi-abolore/lifetechocms-react)
- [LifeTechOCMS Theme Marketplace](https://www.lifetech.host/hubs/community/products?product=theme)

## License

Refer to the repository's `LICENSE` file for applicable terms. If one is not yet present, the project maintainers should select and add a license before describing the project as MIT-licensed.
