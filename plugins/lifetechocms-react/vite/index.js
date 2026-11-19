
import path from 'node:path';

import { generateEntries } from './GenerateEntries.js';
import { generateLayoutHtml } from './GenerateLayoutHtml.js';
import { discoverLayouts } from './DiscoverLayouts.js';

export default function lifetechReact(options = {}) {

  // 1. Plugin options
  const layoutsDirectory =
    options.layoutsDirectory ?? 'src/Layouts';

  const viewsDirectory =
    options.viewsDirectory ?? 'src/Views';

  const themeName = options.themeName;

  if (!themeName || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(themeName)) {
    throw new Error(
      'LifeTechOCMS: Provide a valid themeName in Vite configuration.'
    );
  }

  // 2. Virtual module identifiers
  const viewsVirtualId = 'virtual:lifetech-views';
  const resolvedViewsId = '\0' + viewsVirtualId;

  // 3. Plugin variables
  let projectRoot;
  let buildOutputDirectory;
  let virtualModules = {};

  return {
    name: 'lifetechocms-react',

    enforce: 'pre',

    // 4. Discover Layouts and generate Vite entries
    config(config) {
      projectRoot = path.resolve(
        config.root || process.cwd()
      );

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
          assetsDir: 'Assets',
          rolldownOptions: {
            input: generated.entries,
            output: {
              entryFileNames: 'Assets/js/[name]-[hash].js',
              chunkFileNames: 'Assets/js/[name]-[hash].js',
              assetFileNames: (assetInfo) => {
                const name = assetInfo.names?.[0] ?? '';

                if (name.endsWith('.css')) {
                  return 'Assets/css/[name]-[hash][extname]';
                }

                return 'Assets/[name]-[hash][extname]';
              }
            }
          }
        }
      };

    },

    // 5. Get the final Vite build output directory
    configResolved(config) {
      buildOutputDirectory = path.resolve(
        config.root,
        config.build.outDir
      );
    },

    // 6. Resolve virtual modules
    resolveId(id) {
      if (id === viewsVirtualId) {
        return resolvedViewsId;
      }

      if (Object.hasOwn(virtualModules, id)) {
        return id;
      }
    },

    // 7. Load React Views and generated Layout entries
    load(id) {
      if (id === resolvedViewsId) {

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
    },

    // 8. Generate LifeTechOCMS HTML Layouts after build
   closeBundle() {
      generateLayoutHtml({
        outputDirectory: buildOutputDirectory,
        projectRoot,
        viewsDirectory,
        themeName
      });
    }

  };
}
