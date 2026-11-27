# ThemeLtReactKit – Theme Naming Convention

ThemeLtReactKit establishes a consistent naming convention for ReactJS themes developed for **LifeTechOCMS**.

## Theme Package Naming

Every ReactJS theme package must use the following format:

```text
ThemeRj<DeveloperThemeName>
```

The name has three parts:

| Part | Meaning |
| --- | --- |
| `Theme` | The required prefix for theme packages in LifeTechOCMS. |
| `Rj` | Identifies the theme as a ReactJS theme. |
| `<DeveloperThemeName>` | A descriptive name chosen by the developer, written in PascalCase. |

### Examples

```text
ThemeRjBlog
ThemeRjPortfolio
ThemeRjDashboard
ThemeRjNewsPortal
```

### Rules

- Begin every ReactJS theme package name with **`ThemeRj`**.
- Add a descriptive developer-selected theme name immediately after the prefix.
- Use **PascalCase** for the developer-selected portion.
- Do not insert spaces, hyphens, or underscores into the package name.
- Apply this convention to the **LifeTechOCMS theme package name**. The GitHub repository name and npm package name may follow their own naming rules.

## Configuring the Theme Name

In a Vite project using `@lifetechocms/react`, configure the theme name in `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import lifetechReact from '@lifetechocms/react/vite';

export default defineConfig({
  plugins: [
    react(),
    lifetechReact({
      themeName: 'ThemeRjBlog',
      layoutsDirectory: 'src/Layouts',
      viewsDirectory: 'src/Views'
    })
  ],
  base: './'
});
```

The `themeName` value should follow the `ThemeRj` convention when preparing a React theme for LifeTechOCMS.

## Related Resources

- [Project README](README.md)
- [Contribution Guidelines](CONTRIBUTING.md)
- [ThemeLtReactKit repository](https://github.com/ajayi-abolore/ThemeLtReactKit)

---

This document records the currently agreed **theme naming convention**. Additional conventions can be added after they are tested and agreed upon by contributors.
