import { exportTheme } from '@lifetechocms/react/exporter';

exportTheme({
  projectRoot: process.cwd(),
  themeName: 'ThemeLtReactTest',
  buildDirectory: 'dist',
  exportDirectory: 'exports'
});
