
import fs from 'node:fs';
import path from 'node:path';

export function discoverLayouts(projectRoot, layoutsDirectory = 'src/Layouts') {
  const directory = path.resolve(projectRoot, layoutsDirectory);

  if (!fs.existsSync(directory)) {
    throw new Error(
      `LifeTechOCMS Layout directory not found: ${directory}`
    );
  }

  const files = fs.readdirSync(directory);

  const layouts = {};

  for (const file of files) {
    if (!file.endsWith('.jsx')) continue;

    const name = path.basename(file, '.jsx');

    layouts[name] = path.join(directory, file);
  }

  if (Object.keys(layouts).length === 0) {
    throw new Error('No React Layouts found in ' + directory);
  }

  return layouts;
}
