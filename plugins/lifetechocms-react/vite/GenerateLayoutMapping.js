import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export async function generateLayoutMapping({
  projectRoot,
  outputDirectory,
  themeName,
  mappingFile = 'src/LayoutMapping.js'
}) {
  const sourcePath = path.resolve(projectRoot, mappingFile);

  if (!fs.existsSync(sourcePath)) {
    console.log('[LifeTechOCMS] No Layout Mapping found.');
    return;
  }

  const { default: mapping } = await import(
    pathToFileURL(sourcePath).href
  );

  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
    throw new Error('LifeTechOCMS: Invalid Layout Mapping.');
  }

  const layoutsDirectory = path.join(outputDirectory, 'Layouts');
  const viewsDirectory = path.join(outputDirectory, 'Views');

  const pendingLayouts = [];
  const assignedViews = new Set();

  for (const [layoutName, viewNames] of Object.entries(mapping)) {
    const layoutFile = `${layoutName}.html`;

    if (!fs.existsSync(path.join(layoutsDirectory, layoutFile))) {
      throw new Error(
        `LifeTechOCMS: Layout not found: ${layoutFile}`
      );
    }

    if (!Array.isArray(viewNames)) {
      throw new Error(
        `LifeTechOCMS: Expected an array of Views for ${layoutName}`
      );
    }

    for (const viewName of viewNames) {
      const viewFile = `${viewName}.html`;

      if (!fs.existsSync(path.join(viewsDirectory, viewFile))) {
        throw new Error(
          `LifeTechOCMS: View not found: ${viewFile}`
        );
      }

      if (assignedViews.has(viewName)) {
        throw new Error(
          `LifeTechOCMS: View assigned more than once: ${viewName}`
        );
      }

      assignedViews.add(viewName);

      pendingLayouts.push({
        layoutName: layoutFile,
        contentName: viewFile,
        layoutPackageName: themeName
      });
    }
  }

  const destination = path.join(
    outputDirectory,
    'Storage',
    'Layouts',
    'PendingLayouts.json'
  );

  fs.mkdirSync(path.dirname(destination), {
    recursive: true
  });

  fs.writeFileSync(
    destination,
    JSON.stringify(pendingLayouts, null, 2) + '\n',
    'utf8'
  );

  console.log(
    `[LifeTechOCMS] Generated ${pendingLayouts.length} Layout mappings.`
  );
}