import fs from 'node:fs';
import path from 'node:path';

export function generateEntries(
  layouts,
  pluginRoot,
  projectRoot,
  viewsDirectory = 'src/Views'
) {
  const entries = {};
  const modules = {};

  const normalize = file => file.replace(/\\/g, '/');

  const layoutRuntime = normalize(
    path.resolve(pluginRoot, 'runtime/LifeTechEntry.jsx')
  );

  const viewRuntime = normalize(
    path.resolve(pluginRoot, 'runtime/LifeTechViewEntry.jsx')
  );

  // Generate independent Layout entries.
  for (const [name, layoutPath] of Object.entries(layouts)) {
    const virtualId = `virtual:lifetech-layout-${name}`;
    const resolvedId = `\0${virtualId}`;

    entries[name] = resolvedId;

    modules[resolvedId] = `
      import Layout from ${JSON.stringify(normalize(layoutPath))};
      import { mountLifeTechLayout } from
        ${JSON.stringify(layoutRuntime)};

      mountLifeTechLayout(Layout);
    `;
  }

  // Generate independent View entries.
  const viewsPath = path.resolve(projectRoot, viewsDirectory);

  if (!fs.existsSync(viewsPath)) {
    throw new Error(
      `LifeTechOCMS: Views directory not found: ${viewsPath}`
    );
  }

  const viewFiles = fs.readdirSync(viewsPath)
    .filter(file => file.endsWith('.jsx'))
    .sort();

  for (const file of viewFiles) {
    const name = path.basename(file, '.jsx');
    const viewPath = normalize(path.join(viewsPath, file));

    const virtualId = `virtual:lifetech-view-${name}`;
    const resolvedId = `\0${virtualId}`;

    // Prefix the entry name to avoid collisions
    // between Layout and View names.
    entries[`View${name}`] = resolvedId;

    modules[resolvedId] = `
      import View from ${JSON.stringify(viewPath)};
      import { mountLifeTechView } from
        ${JSON.stringify(viewRuntime)};

      document
        .querySelectorAll('[data-lt-view="${name}"]')
        .forEach(element => {
          mountLifeTechView(element, View);
        });
    `;
  }

  return {
    entries,
    modules
  };
}