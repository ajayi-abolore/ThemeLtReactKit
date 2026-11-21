
import fs from 'node:fs';
import path from 'node:path';

export function discoverLayouts(projectRoot, layoutsDirectory = 'src/Layouts') {
    const directory = path.resolve(
      projectRoot,
      layoutsDirectory
    );

    // Layouts are optional.
    if (!fs.existsSync(directory)) {
      return {};
    }

    if (!fs.statSync(directory).isDirectory()) {
      throw new Error(
        `LifeTechOCMS: Expected a directory: ${directory}`
      );
    }
    
    const layouts = {};

    for (const file of fs.readdirSync(directory).sort()) {
      if (!file.endsWith('.jsx')) continue;

      const name = path.basename(file, '.jsx');

      layouts[name] = path.join(directory, file);
    }

    return layouts;
  }
