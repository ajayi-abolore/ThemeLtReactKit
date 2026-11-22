#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { exportTheme } from '../exporter/index.js';

const projectRoot = process.cwd();

const metadataPath = path.join(
  projectRoot,
  'dist',
  'lifetech-theme.json'
);

try {
  if (!fs.existsSync(metadataPath)) {
    throw new Error(
      'Theme metadata not found. Run npm run build first.'
    );
  }

  const metadata = JSON.parse(
    fs.readFileSync(metadataPath, 'utf8')
  );

  if (!metadata.themeName) {
    throw new Error(
      'Theme name is missing from build metadata.'
    );
  }

  exportTheme({
    projectRoot,
    themeName: metadata.themeName,
    buildDirectory: 'dist',
    exportDirectory: 'lt-exports'
  });

  console.log('[LifeTechOCMS] Theme export completed.');
} catch (error) {
  console.error(
    '[LifeTechOCMS] Export failed:',
    error.message
  );

  process.exitCode = 1;
}