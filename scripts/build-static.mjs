import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEPLOYABLE_DIRECTORIES, resolveInside } from './lib/site-contract.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolveInside(repositoryRoot, 'dist');

if (outputDirectory !== path.join(repositoryRoot, 'dist')) {
  throw new Error('Refusing to build outside the repository dist directory.');
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const rootEntries = await readdir(repositoryRoot, { withFileTypes: true });
const htmlFiles = rootEntries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
  .map((entry) => entry.name)
  .sort();

for (const filename of htmlFiles) {
  await cp(resolveInside(repositoryRoot, filename), resolveInside(outputDirectory, filename));
}

for (const directory of DEPLOYABLE_DIRECTORIES) {
  await cp(resolveInside(repositoryRoot, directory), resolveInside(outputDirectory, directory), {
    recursive: true,
  });
}

console.log(
  `Built ${htmlFiles.length} HTML routes and ${DEPLOYABLE_DIRECTORIES.length} asset directories into dist/.`,
);
