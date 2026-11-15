# ThemeLtReactKit

**An experimental React and Vite theme development toolkit for LifeTechOCMS.**

ThemeLtReactKit is an open-source project exploring how React applications can be integrated into LifeTechOCMS themes.

The project aims to establish reusable development conventions for React-based **Layouts, Views, Components, and Assets**, while preserving LifeTechOCMS's existing routing, page management, and dynamic content architecture.

> **Development Status: Experimental**
>
> ThemeLtReactKit is currently under active development and testing. Developers and contributors are welcome to participate in testing, reporting issues, and improving the integration.

## Project Objectives

- Enable React and JSX development within LifeTechOCMS themes.
- Integrate React Layouts with LifeTechOCMS dynamic content.
- Support multiple React Views on the same page.
- Preserve React features such as `useState`, `useEffect`, and event handlers.
- Establish standard conventions for React theme development.
- Develop a reusable React integration plugin.
- Support Vite-powered compilation and theme export.

## How It Works

LifeTechOCMS remains responsible for page routing, Layout assignment, and content management.

React handles the user interface through compiled JSX components.

```text
LifeTechOCMS
    |
    ├── Page Routing
    |
    ├── Assigned Layout
    |       |
    |       └── React Layout
    |               |
    |               └── Dynamic Content
    |                       |
    |                       ├── React Blog View
    |                       |
    |                       └── React Home View
    |
    └── Theme Assets
            |
            └── Vite Compiled Files
```

### Dynamic React Views

The integration currently supports loading multiple React Views through HTML placeholders:

```html
<div data-lt-view="Blog"></div>
<div data-lt-view="Home"></div>
```

These placeholders are associated with React components such as:

```text
src/Views/
├── Blog.jsx
└── Home.jsx
```

LifeTechOCMS determines which contents are assigned to a page, while the React integration renders the corresponding JSX Views.

This functionality has been demonstrated in initial integration tests.

## Technologies

| Technology | Purpose |
|---|---|
| LifeTechOCMS | Framework and content management |
| React | User interface development |
| JSX | Component development |
| Vite | Development and build tooling |
| JavaScript | Integration runtime |
| MdBlog | Practical integration testing |

## Project Structure

The following structure represents the current development direction and may evolve:

```text
ThemeLtReactKit/
├── src/
│   ├── Layouts/
│   ├── Views/
│   ├── Components/
│   ├── Assets/
│   ├── Routes/
│   ├── App.jsx
│   └── main.jsx
├── plugins/
│   └── lifetech-react/
├── scripts/
├── vite.config.js
└── package.json
```

The `plugins/lifetech-react` directory is intended to contain the reusable integration logic currently being extracted from the React application.

## Getting Started

Once the project files are available in the repository, clone the project:

```bash
git clone https://github.com/lifetechOCMS/ThemeLtReactKit.git
```

Navigate to the project directory:

```bash
cd ThemeLtReactKit
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the React application:

```bash
npm run build
```

**Note:** Building the React application does not automatically install the theme in LifeTechOCMS. Theme export and installation automation are still under development.

## Integration Testing with MdBlog

ThemeLtReactKit uses **MdBlog** as its primary practical testing module.

Our integration tests focus on:

- Rendering MdBlog-related interfaces through React Views.
- Loading multiple React Views on a single LifeTechOCMS page.
- Displaying dynamically assigned content inside React Layouts.
- Testing React state management and event handlers.
- Verifying compiled JavaScript and CSS integration.
- Evaluating compatibility between React components and LifeTechOCMS content management.

## Development Roadmap

- [x] Establish React and Vite development environment.
- [x] Integrate a compiled React Layout with LifeTechOCMS.
- [x] Render multiple React Views dynamically.
- [x] Display LifeTechOCMS content within a React Layout.
- [ ] Consolidate the integration into a local plugin.
- [ ] Implement automatic Layout discovery.
- [ ] Improve React lifecycle and DOM integration.
- [ ] Automate React theme compilation and export.
- [ ] Establish standard React theme development conventions.
- [ ] Prepare a reusable standalone integration plugin.

The roadmap is subject to change as testing progresses.

## Contributing

We welcome contributions from developers interested in React, Vite, PHP, and LifeTechOCMS.

As this project is experimental, contributions involving testing, bug reports, documentation, and architectural suggestions are particularly valuable.

### How to Contribute

1. Fork the repository.
2. Create a new branch for your changes.
3. Implement and test your changes.
4. Commit and push your work.
5. Submit a pull request describing your contribution.

Where possible, test integration changes using MdBlog and include reproduction steps for any issues discovered.

For major architectural changes, please open an issue for discussion before implementation.

### Report Issues

For issues specifically related to ThemeLtReactKit, use the repository's GitHub Issues section.

For general LifeTechOCMS framework issues, please visit:

[LifeTechOCMS Issues](https://github.com/lifetechOCMS/lifetechocms/issues)

## Related Projects

- [LifeTechOCMS Framework](https://github.com/lifetechOCMS/lifetechocms)
- [LifeTechOCMS Documentation](https://github.com/lifetechOCMS/docs)
- [ThemeStarter](https://github.com/ajayi-abolore/ThemeStarter)

## License

ThemeLtReactKit is intended to be released under the **MIT License**. The repository should include a `LICENSE` file containing the applicable terms.

---

**ThemeLtReactKit — Building the future of React-powered themes for LifeTechOCMS.**
