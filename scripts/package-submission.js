import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);
const rootDir = path.resolve(currentDirname, '..');

const DEFAULT_OUTPUT = 'submission.zip';
const EXCLUDE_NAMES = new Set([
  'node_modules',
  '.git',
  'dist',
  'storybook-static',
  '.scratch',
  '.gemini',
  'submission.zip',
  'AGENTS.md',
  'GLOSSARY.md',
  'docs',
]);

function createZip(sourceDir, outputFile, excludes) {
  const files = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(sourceDir, fullPath).replace(/\\/g, '/');
      const rootSegment = relativePath.split('/')[0];

      if (
        excludes.has(rootSegment)
        || excludes.has(entry.name)
        || relativePath.startsWith('cypress/videos')
        || relativePath.startsWith('cypress/screenshots')
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        files.push({ fullPath, relativePath });
      }
    }
  }

  walk(sourceDir);

  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const file of files) {
    const content = fs.readFileSync(file.fullPath);
    const compressed = zlib.deflateRawSync(content);
    const crc = zlib.crc32(content);
    const filenameBuffer = Buffer.from(file.relativePath, 'utf8');

    // Local file header (30 bytes + name length)
    const localHeader = Buffer.alloc(30 + filenameBuffer.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(content.length, 22);
    localHeader.writeUInt16LE(filenameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);
    filenameBuffer.copy(localHeader, 30);

    // Central directory file header (46 bytes + name length)
    const centralHeader = Buffer.alloc(46 + filenameBuffer.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(content.length, 24);
    centralHeader.writeUInt16LE(filenameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    filenameBuffer.copy(centralHeader, 46);

    localHeaders.push(localHeader, compressed);
    centralHeaders.push(centralHeader);

    offset += localHeader.length + compressed.length;
  }

  const centralDirSize = centralHeaders.reduce((sum, h) => sum + h.length, 0);
  const centralDirOffset = offset;

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20);

  const zipBuffer = Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
  const targetPath = path.resolve(sourceDir, outputFile);
  fs.writeFileSync(targetPath, zipBuffer);

  return {
    filePath: targetPath,
    fileCount: files.length,
    sizeBytes: zipBuffer.length,
  };
}

const outputFile = process.argv[2] || DEFAULT_OUTPUT;
console.log(`Packaging submission from ${rootDir}...`);
const result = createZip(rootDir, outputFile, EXCLUDE_NAMES);
console.log(`Successfully created ${result.filePath}`);
console.log(`Included ${result.fileCount} files (${(result.sizeBytes / 1024).toFixed(2)} KB).`);
