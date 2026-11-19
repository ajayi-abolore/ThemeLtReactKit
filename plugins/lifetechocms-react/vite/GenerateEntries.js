
import path from 'node:path';

export function generateEntries(layouts, pluginRoot) {
  const entries = {};
  const modules = {};

  const runtimePath = path
    .resolve(pluginRoot, 'runtime/LifeTechEntry.jsx')
    .replace(/\\/g, '/');

  for (const [name, layoutPath] of Object.entries(layouts)) {
    const virtualId = `virtual:lifetech-layout-${name}`;
    const resolvedId = `\0${virtualId}`;

    entries[name] = resolvedId;

    const normalizedLayout = layoutPath.replace(/\\/g, '/');

    modules[resolvedId] = `
      import Layout from ${JSON.stringify(normalizedLayout)};
      import { mountLifeTechLayout } from
        ${JSON.stringify(runtimePath)};

      mountLifeTechLayout(Layout);
    `;
  }

  return {
    entries,
    modules
  };
}
