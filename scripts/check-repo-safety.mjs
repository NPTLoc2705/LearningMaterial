#!/usr/bin/env node
/**
 * S0-T06: Public-repository safety check (secrets + forbidden slide/dump files).
 * Usage:
 *   node scripts/check-repo-safety.mjs          # scans git-tracked + untracked non-ignored files
 *   node scripts/check-repo-safety.mjs --self-test
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const FORBIDDEN_EXTENSIONS = new Set(['.pdf', '.pptx', '.dump', '.bak']);
const SECRET_PATTERNS = [
  { name: 'Google/Gemini API Key', regex: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: 'Supabase Service Role / JWT Secret', regex: /\beyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[0-9A-Za-z_-]{20,}\.[0-9A-Za-z_-]{20,}\b/ },
  { name: 'PostgreSQL Connection String with Password', regex: /postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@[^/\s]+/i },
  { name: 'Private Key Block', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
];

export function checkFile(relPath, content = null) {
  const normalized = relPath.replace(/\\/g, '/');
  const ext = path.extname(normalized).toLowerCase();
  const violations = [];

  if (FORBIDDEN_EXTENSIONS.has(ext)) {
    const allowedInDocs = (ext === '.pdf' || ext === '.pptx') && normalized.startsWith('docs/');
    if (!allowedInDocs) {
      violations.push(`Forbidden file type (${ext}) outside docs/: ${normalized}`);
    }
  }

  if (
    normalized.endsWith('.local.json') ||
    normalized === '.env' ||
    normalized === '.env.local' ||
    (/appsettings(\.[^/]+)?\.json$/i.test(normalized) && !normalized.endsWith('.example'))
  ) {
    violations.push(`Local secret/appsettings configuration file must not be tracked: ${normalized}`);
  }

  if (content !== null) {
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.regex.test(content)) {
        violations.push(`Potential secret detected (${pattern.name}) in ${normalized}`);
      }
    }
  }

  return violations;
}

function runSelfTest() {
  const fakeKey = 'AIza' + 'SyD1234567890abcdefghijklmnopqrstuv';
  const v1 = checkFile('lesson1.pdf', '');
  const v2 = checkFile('server/appsettings.json', `GeminiKey = "${fakeKey}"`);
  const v3 = checkFile('docs/platform/00-README.md', '# Safe markdown');

  if (v1.length === 0 || v2.length === 0 || v3.length > 0) {
    console.error('Self-test FAILED:', { v1, v2, v3 });
    process.exit(1);
  }
  console.log('PASS: check-repo-safety self-test caught forbidden .pdf and fake Gemini key.');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
  process.exit(0);
}

const rootDir = process.cwd();
const allViolations = [];
let totalScanned = 0;

function scanGitRepo(repoDir, prefix = '') {
  let files = [];
  try {
    const output = execSync('git ls-files --cached --others --exclude-standard', {
      cwd: repoDir,
      encoding: 'utf8',
    });
    files = output.split(/\r?\n/).filter(Boolean);
  } catch {
    return;
  }

  for (const relPath of files) {
    const fullPath = path.join(repoDir, relPath);
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) continue;
    totalScanned++;

    let content = null;
    const ext = path.extname(relPath).toLowerCase();
    const isBinary = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.woff', '.woff2'].includes(ext);
    if (!isBinary) {
      try {
        content = fs.readFileSync(fullPath, 'utf8');
      } catch {
        content = null;
      }
    }

    const displayPath = prefix ? `${prefix}/${relPath}` : relPath;
    allViolations.push(...checkFile(displayPath, content));
  }
}

scanGitRepo(rootDir);
const serverRepoDir = path.join(rootDir, 'server');
if (fs.existsSync(path.join(serverRepoDir, '.git'))) {
  scanGitRepo(serverRepoDir, 'server');
}

if (allViolations.length > 0) {
  console.error('Repository safety check FAILED:');
  for (const v of allViolations) {
    console.error(`  - ${v}`);
  }
  process.exit(1);
}

console.log(`PASS: Scanned ${totalScanned} files across root and server repos. No secrets or forbidden files detected.`);
