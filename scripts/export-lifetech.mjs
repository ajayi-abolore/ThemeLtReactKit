import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';


// Find the directory containing this script.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate our configuration file.
const configPath = path.join(
  __dirname,
  'lifetech.config.json'
);

// Read the JSON configuration.
const config = JSON.parse(
  fs.readFileSync(configPath, 'utf8')
);

// Display the configuration.
console.log('LifeTechOCMS React Exporter v1.0');
console.log('--------------------------------');
console.log('Theme Name:', config.themeName);
console.log('Version:', config.version);
console.log('Build Directory:', config.buildDirectory);
console.log('Output Directory:', config.outputDirectory);
console.log('React Mount ID:', config.reactMountId);
console.log('Default View:', config.defaultView);
console.log('Default Layout:', config.defaultLayout);

// Step 3: Validate the Vite build directory.

// Get the React project root directory.
const projectRoot = path.resolve(__dirname, '..');

// Locate the compiled Vite directory.
const buildPath = path.resolve(
  projectRoot,
  config.buildDirectory
);

console.log('\nChecking Vite build directory...');
console.log('Build Path:', buildPath);

// Check whether the directory exists.
if (!fs.existsSync(buildPath)) {
  console.error('ERROR: Vite build directory not found.');
  console.error('Please run: npm run build');
  process.exit(1);
}

// Check whether index.html exists.
const indexPath = path.join(buildPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: index.html not found in build directory.');
  process.exit(1);
}

console.log('SUCCESS: Vite build directory found.');
console.log('SUCCESS: index.html found.');

// Display compiled files.
console.log('\nCompiled files:');

for (const file of fs.readdirSync(buildPath)) {
  console.log('-', file);
}


// Step 4: Export React resources to LifeTechOCMS folders.

const resourceTypes = [
  'Layouts',
  'Views',
  'Components'
];

const exportedThemePath = path.join(
  projectRoot,
  config.outputDirectory,
  config.themeName
);

for (const resourceType of resourceTypes) {

  const sourceDirectory = path.join(
    projectRoot,
    'src',
    resourceType
  );

  const outputDirectory = path.join(
    exportedThemePath,
    resourceType
  );

  if (!fs.existsSync(sourceDirectory)) {
    console.log(`SKIPPED: ${resourceType} directory not found.`);
    continue;
  }

  fs.mkdirSync(outputDirectory, {
    recursive: true
  });

  const resourceFiles = fs.readdirSync(sourceDirectory)
    .filter(file => /\.(jsx|tsx)$/.test(file));

  for (const file of resourceFiles) {

    const resourceName = path.parse(file).name;

    const sourceFile = path.join(
      sourceDirectory,
      file
    );

    const outputFile = path.join(
      outputDirectory,
      `${resourceName}.html`
    );

    const sourceContent = fs.readFileSync(
      sourceFile,
      'utf8'
    );

    // Preserve the actual React source for inspection.
    fs.writeFileSync(
      outputFile,
      sourceContent,
      'utf8'
    );

    console.log(
      `Exported: ${resourceType}/${file} -> ${resourceType}/${resourceName}.html`
    );
  }
}

console.log('\nSUCCESS: LifeTechOCMS resources exported.');