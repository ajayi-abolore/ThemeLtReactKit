import path from 'node:path';

import { discoverLayouts } from './DiscoverLayouts.js';
import { generateEntries } from './GenerateEntries.js';

export default function lifetechReact(options = {}) {
  const layoutsDirectory =
    options.layoutsDirectory ?? 'src/Layouts';

  const viewsDirectory =
    options.viewsDirectory ?? 'src/Views';

  const viewsVirtualId = 'virtual:lifetech-views';
  const resolvedViewsId = '\0' + viewsVirtualId;

  let projectRoot;
  let virtualModules = {};

  return {
    name: 'lifetechocms-react',

    enforce: 'pre',

    config(config) {
      projectRoot = path.resolve(config.root || process.cwd());

      const layouts = discoverLayouts(
        projectRoot,
        layoutsDirectory
      );

      const pluginRoot = path.resolve(
        import.meta.dirname,
        '..'
      );

      const generated = generateEntries(
        layouts,
        pluginRoot
      );

      virtualModules = generated.modules;

      return {
        build: {
          manifest: true,
          rolldownOptions: {
            input: generated.entries
          }
        }
      };
    },

    resolveId(id) {
      if (id === viewsVirtualId) {
        return resolvedViewsId;
      }

      if (Object.hasOwn(virtualModules, id)) {
        return id;
      }
    },

    load(id) {
    if (id === resolvedViewsId) {
        // Vite requires a project-root-relative glob pattern.
        const pattern = '/' +
        viewsDirectory
            .replace(/\\/g, '/')
            .replace(/^\/+|\/+$/g, '') +
        '/*.jsx';

        return `
        const modules = import.meta.glob(
            ${JSON.stringify(pattern)},
            { eager: true }
        );

        const views = {};

        for (const [file, module] of Object.entries(modules)) {
            const name = file.split('/').pop().replace(/\\.jsx$/, '');
            views[name] = module.default;
        }

        export default views;
        `;
    }

    return virtualModules[id];
    }


  };
}
