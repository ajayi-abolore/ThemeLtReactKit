
import fs from 'node:fs';
import path from 'node:path';

import { validateTheme } from './ValidateTheme.js';

export function exportTheme({
  projectRoot = process.cwd(),
  themeName,
  buildDirectory = 'dist',
  exportDirectory = 'exports'
}) {
  if (!themeName ||
      !/^[A-Za-z][A-Za-z0-9_-]*$/.test(themeName)) {
    throw new Error('LifeTechOCMS: Invalid theme name.');
  }

  const root = path.resolve(projectRoot);
  const source = path.resolve(root, buildDirectory);
  const exportRoot = path.resolve(root, exportDirectory);
  const destination = path.join(exportRoot, themeName);

  // Protect the source build and project directories.
  if (source === root ||
      exportRoot === root ||
      destination === source ||
      destination.startsWith(source + path.sep) ||
      source.startsWith(destination + path.sep)) {
    throw new Error(
      'LifeTechOCMS: Unsafe build or export directory.'
    );
  }

  const resources = validateTheme(source);

  fs.mkdirSync(exportRoot, { recursive: true });

  // Use a temporary directory so an incomplete copy does not
  // replace an existing export.
  const temporary = fs.mkdtempSync(
    path.join(exportRoot, '.lifetech-export-')
  );

  try {
    for (const folder of ['Assets', 'Layouts', 'Views']) {
      fs.cpSync(
        path.join(source, folder),
        path.join(temporary, folder),
        { recursive: true }
      );
    }

    // Preserve any existing export until the copy is complete.
    const backup = destination + '.backup';

    if (fs.existsSync(backup)) {
      throw new Error(
        `Remove or rename the existing backup first: ${backup}`
      );
    }

    const hadExisting = fs.existsSync(destination);

    if (hadExisting) {
      fs.renameSync(destination, backup);
    }

    try {
      fs.renameSync(temporary, destination);
    } catch (error) {
      if (hadExisting && fs.existsSync(backup)) {
        fs.renameSync(backup, destination);
      }
      throw error;
    }

    if (hadExisting) {
      fs.rmSync(backup, { recursive: true, force: true });
    }

    console.log(
      `[LifeTechOCMS] Exported theme: ${destination}`
    );
    console.log(
      `[LifeTechOCMS] Layouts: ${resources.layouts.length}`
    );
    console.log(
      `[LifeTechOCMS] Views: ${resources.views.length}`
    );

    return destination;
  } finally {
    if (fs.existsSync(temporary)) {
      fs.rmSync(temporary, { recursive: true, force: true });
    }
  }
}
