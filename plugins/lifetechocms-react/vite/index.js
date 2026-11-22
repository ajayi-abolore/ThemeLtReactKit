import fs from 'node:fs';
import path from 'node:path';

import {  generateEntries} from './GenerateEntries.js';
import {  generateLayoutHtml} from './GenerateLayoutHtml.js';
import {  discoverLayouts} from './DiscoverLayouts.js';
import {  generateLayoutMapping} from './GenerateLayoutMapping.js';
import {  generateThemeMetadata} from './GenerateThemeMetadata.js';

export default function lifetechReact(options = {}) {

  // 1. Plugin options
  const layoutsDirectory =
    options.layoutsDirectory ?? 'src/Layouts';

  const viewsDirectory =
    options.viewsDirectory ?? 'src/Views';

  const themeName = options.themeName;

  if (
    !themeName ||
    !/^[A-Za-z][A-Za-z0-9_-]*$/.test(themeName)
  ) {
    throw new Error(
      'LifeTechOCMS: Provide a valid themeName in Vite configuration.'
    );
  }
  // Activate LifeTech generation only during lt-export.
  if (process.env.LIFETECH_BUILD !== 'true') {
    return {
      name: 'lifetechocms-react'
    };
  }
  // 2. Virtual module identifiers
  const viewsVirtualId = 'virtual:lifetech-views';
  const resolvedViewsId = '\0' + viewsVirtualId;

  // 3. Plugin variables
  let projectRoot;
  let buildOutputDirectory;
  let discoveredLayouts = {};
  let virtualModules = {};

  return {
    name: 'lifetechocms-react',

    enforce: 'pre',

    // 4. Discover Layouts and generate Vite entries
    config(config) {
      projectRoot = path.resolve(
        config.root || process.cwd()
      );

      // Reset virtual modules for this build.
      virtualModules = {};

      const layouts = discoverLayouts(
        projectRoot,
        layoutsDirectory
      );

      // Generate Default Layout if none exists.
      if (Object.keys(layouts).length === 0) {
        const defaultLayoutId =
          'virtual:lifetech-default-layout';

        layouts.Default = defaultLayoutId;

        virtualModules['\0' + defaultLayoutId] = `
          import React from 'react';

          export default function Default({ children }) {
            return React.createElement(
              React.Fragment,
              null,
              children
            );
          }
        `;

        console.log(
          '[LifeTechOCMS] Using generated Default Layout.'
        );
      }

      // Retain Layouts for HTML generation.
      discoveredLayouts = layouts;

      const pluginRoot = path.resolve(
        import.meta.dirname,
        '..'
      );

      const generated = generateEntries(
        layouts,
        pluginRoot,
        projectRoot,
        viewsDirectory
      );

      virtualModules = {
        ...virtualModules,
        ...generated.modules
      };

      return {
        build: {
          manifest: true,
          assetsDir: 'Assets',

          rolldownOptions: {
            input: generated.entries,

            output: {
              entryFileNames: 'Assets/js/[name].js',

              chunkFileNames:
                'Assets/js/LtChunk-[name].js',

              assetFileNames: assetInfo => {
                const name =
                  assetInfo.names?.[0] ?? '';

                if (name.endsWith('.css')) {
                  return 'Assets/css/[name][extname]';
                }

                return 'Assets/[name][extname]';
              }
            }
          }
        }
      };
    },

    // 5. Resolve the final build directory.
    /*configResolved(config) {
      buildOutputDirectory = path.resolve(
        config.root,
        config.build.outDir
      );
    },*/
    configResolved(config) {
      buildOutputDirectory = path.resolve(
        config.root,
        config.build.outDir
      );

      console.log(
        '[LifeTechOCMS] Output directory:',
        buildOutputDirectory
      );

      console.log(
        '[LifeTechOCMS] Manifest enabled:',
        config.build.manifest
      );
    },

    // 6. Resolve virtual modules.
    resolveId(id) {
      if (id === viewsVirtualId) {
        return resolvedViewsId;
      }

      if (Object.hasOwn(virtualModules, id)) {
        return id;
      }

      const resolvedId = '\0' + id;

      if (Object.hasOwn(virtualModules, resolvedId)) {
        return resolvedId;
      }
    },

    // 7. Load virtual modules.
    load(id) {
      if (id === resolvedViewsId) {
        // Discover nested Views in the configured directory.
        // The glob is evaluated by Vite.
        const directory = viewsDirectory
          .replace(/\\/g, '/')
          .replace(/^\/+|\/+$/g, '');

        const pattern =
          `/${directory}/**/*.{js,jsx,ts,tsx}`;

        return `
          const modules = import.meta.glob(
            ${JSON.stringify(pattern)},
            { eager: true }
          );

          const views = {};

          for (
            const [file, module]
            of Object.entries(modules)
          ) {
            const relativePath = file
              .replace(
                ${JSON.stringify(`/${directory}/`)},
                ''
              )
              .replace(/\\.(js|jsx|ts|tsx)$/, '');

            views[relativePath] = module.default;
          }

          export default views;
        `;
      }

      return virtualModules[id];
    },

    // 8. Generate LifeTech HTML and metadata.
    /*
    async closeBundle() {
      generateLayoutHtml({
        outputDirectory: buildOutputDirectory,
        projectRoot,
        viewsDirectory,
        layouts: discoveredLayouts,
        themeName
      });

      await generateLayoutMapping({
        projectRoot,
        outputDirectory: buildOutputDirectory,
        themeName
      });

      generateThemeMetadata({
        outputDirectory: buildOutputDirectory,
        themeName
      });
    }
    */
    // 8. Generate LifeTech HTML and metadata.
    async closeBundle() {

      const manifestPath = path.join(
        buildOutputDirectory,
        '.vite',
        'manifest.json'
      );

      console.log(
        '[LifeTechOCMS] closeBundle executed.'
      );

      console.log(
        '[LifeTechOCMS] Build directory:',
        buildOutputDirectory
      );

      console.log(
        '[LifeTechOCMS] Manifest exists:',
        fs.existsSync(manifestPath)
      );

      if (!fs.existsSync(manifestPath)) {
        console.log(
          '[LifeTechOCMS] Manifest unavailable during closeBundle.'
        );

        console.log(
          '[LifeTechOCMS] Skipping HTML generation for debugging.'
        );

        return;
      }

      generateLayoutHtml({
        outputDirectory: buildOutputDirectory,
        projectRoot,
        viewsDirectory,
        layouts: discoveredLayouts,
        themeName
      });

      await generateLayoutMapping({
        projectRoot,
        outputDirectory: buildOutputDirectory,
        themeName
      });

      generateThemeMetadata({
        outputDirectory: buildOutputDirectory,
        themeName
      });
    }
  };
}
