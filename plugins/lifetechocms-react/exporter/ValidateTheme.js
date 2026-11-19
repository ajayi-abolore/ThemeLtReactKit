
import fs from 'node:fs';
import path from 'node:path';

export function validateTheme(buildDirectory) {
  if (!fs.existsSync(buildDirectory)) {
    throw new Error(
      `Build directory not found: ${buildDirectory}`
    );
  }

  for (const folder of ['Assets', 'Layouts', 'Views']) {
    const location = path.join(buildDirectory, folder);

    if (!fs.existsSync(location) ||
        !fs.statSync(location).isDirectory()) {
      throw new Error(
        `LifeTechOCMS: Missing build folder: ${folder}`
      );
    }
  }

  const layouts = fs.readdirSync(
    path.join(buildDirectory, 'Layouts')
  ).filter(file => file.endsWith('.html'));

  const views = fs.readdirSync(
    path.join(buildDirectory, 'Views')
  ).filter(file => file.endsWith('.html'));

  if (layouts.length === 0) {
    throw new Error('LifeTechOCMS: No Layout HTML files found.');
  }

  if (views.length === 0) {
    throw new Error('LifeTechOCMS: No View HTML files found.');
  }

  return {
    layouts,
    views
  };
}