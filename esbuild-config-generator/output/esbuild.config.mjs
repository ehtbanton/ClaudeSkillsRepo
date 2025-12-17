import * as esbuild from 'esbuild';

const isProduction = process.env.NODE_ENV === 'production';
const isWatch = process.argv.includes('--watch');

const config = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outdir: 'dist',
  format: 'esm',
  sourcemap: !isProduction,
  minify: isProduction,
  treeShaking: true,
  external: ['pg-native'],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  logLevel: 'info',
};

if (isWatch) {
  const ctx = await esbuild.context(config);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await esbuild.build(config);
  console.log('Build complete!');
}
