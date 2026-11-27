# Contributing to ThemeLtReactKit

Thank you for helping build the first practical React theme reference for [LifeTechOCMS](https://github.com/lifetechOCMS/lifetechocms). Contributions will help establish tested conventions for standalone React development and export to LifeTechOCMS themes.

[Back to README](./README.md)

## Ways to Contribute

You can contribute by testing standalone React behavior, testing exported themes in LifeTechOCMS, integrating MdBlog features, fixing bugs, improving layouts and accessibility, documenting conventions, or proposing new examples. Please [star the repository](https://github.com/ajayi-abolore/ThemeLtReactKit/stargazers) to support its visibility.

## Before You Begin

1. Review the [README](./README.md) and open [issues](https://github.com/ajayi-abolore/ThemeLtReactKit/issues).
2. Discuss significant architectural or routing changes in an issue before implementation.
3. Use the published `@lifetechocms/react` package rather than a local file dependency unless you are explicitly testing plugin changes.
4. Never commit `.env.local`, passwords, bearer tokens, private keys, `node_modules/`, or generated build directories.

## Fork, Branch, and Pull Request

1. Fork [ThemeLtReactKit](https://github.com/ajayi-abolore/ThemeLtReactKit) to your GitHub account.
2. Clone your fork and register the original repository as `upstream`:

   ```bash
   git clone https://github.com/YOUR_USERNAME/ThemeLtReactKit.git
   cd ThemeLtReactKit
   git remote add upstream https://github.com/ajayi-abolore/ThemeLtReactKit.git
   git fetch upstream
   ```

3. Create a focused branch from the latest main:

   ```bash
   git switch main
   git merge --ff-only upstream/main
   git switch -c feature/describe-your-change
   ```

4. Install dependencies and run the application:

   ```bash
   npm install
   npm run dev
   ```

5. Implement your change, test it, and commit:

   ```bash
   npm run lint
   npm run build
   npm run lt-export
   git add .
   git commit -m "Describe the change"
   git push -u origin feature/describe-your-change
   ```

6. Open a pull request from your branch to `ajayi-abolore/ThemeLtReactKit:main`.

Use `npm.cmd` instead of `npm` in PowerShell if script execution policy prevents npm from running.

## Project Conventions

| Area | Current convention |
|---|---|
| Layouts | `src/Layouts/` — React page shells |
| Views | `src/Views/` — React pages, including nested folders |
| Components | `src/Components/` — reusable UI |
| Routes | `src/Routes/` — standalone React routing |
| API | `src/Assets/ApiRequest.js` — shared backend requests |
| Theme export | `@lifetechocms/react` Vite plugin and `npm run lt-export` |

Use descriptive PascalCase names for React Layout and View components. Keep imports and directory names consistent with `vite.config.js`. Avoid adding project-specific assumptions to shared utilities.

These are **provisional conventions**. Proposals to change them are welcome when accompanied by working examples and tests.

## Required Testing

For each relevant pull request, explain which checks were completed:

- **Standalone React:** `npm run dev`; verify navigation, Layouts, Views, and API behavior.
- **Quality checks:** `npm run lint` and `npm run build`.
- **Theme export:** `npm run lt-export`; verify generated `Layouts/`, `Views/`, `Assets/`, and metadata.
- **LifeTechOCMS integration:** import the exported theme, assign pages/layouts as needed, and verify rendering.
- **MdBlog:** where applicable, test real API responses, empty/error states, and backend permissions.

If you cannot test LifeTechOCMS integration, say so explicitly in your pull request. Do not claim export compatibility based only on a successful Vite build.

## Pull Request Description

Include a short summary, the issue being addressed, files or conventions changed, standalone test results, export test results, LifeTechOCMS/MdBlog test results (if applicable), and screenshots for visible UI changes.

Example:

```markdown
## Summary
- Add or improve ...

## Testing
- [ ] npm run lint
- [ ] npm run build
- [ ] npm run lt-export
- [ ] Standalone React navigation checked
- [ ] Exported theme tested in LifeTechOCMS
- [ ] MdBlog integration tested (if applicable)

## Notes
- Known limitations or untested cases:
```

## Reporting Issues

Use [ThemeLtReactKit Issues](https://github.com/ajayi-abolore/ThemeLtReactKit/issues) for application, layout, view, and integration issues. Include steps to reproduce, expected and actual behavior, Node/npm/React/Vite versions, plugin version, and whether the problem occurs in standalone mode, exported mode, or both. Remove tokens and private information from logs.

For problems specifically in the exporter plugin, report them at [lifetechocms-react Issues](https://github.com/ajayi-abolore/lifetechocms-react/issues). For core framework defects, use [LifeTechOCMS Issues](https://github.com/lifetechOCMS/lifetechocms/issues).

## Collaboration

Be respectful and constructive in issues and pull requests. Keep PRs focused, respond to review feedback, and avoid unrelated refactoring. Major conventions should be adopted only after evidence from practical tests.

[Back to README](./README.md)
