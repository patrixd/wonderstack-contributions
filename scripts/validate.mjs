#!/usr/bin/env node
/**
 * Validates every file in tools/ and training/ (no dependencies; Node 22+):
 *   - YAML subset + JSON Schema (schema/*.schema.json, same rules as scripts/lib/community-files.mjs)
 *   - file name matches the id / slug; ids unique; no two tools share the same official URL
 *   - training: job is in jobs.json; a tool id with no file in tools/ is a warning
 *     (the tool may already be listed on WonderStack — this repo does not copy that catalog)
 *   - no personal data (e-mails, phone numbers, things that look like keys)
 *   - the committed schema files equal the ones in the library (they are generated together)
 * Exit code 1 on any error. In GitHub Actions, errors are printed as annotations on the file.
 *
 *   node scripts/validate.mjs [files…]     (no files = everything)
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOOL_SCHEMA, TRAINING_SCHEMA, parseToolFile, parseTrainingFile, personalDataIn } from './lib/community-files.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const GH = process.env.GITHUB_ACTIONS === 'true';
const errors = [];
const warnings = [];
const err = (file, msg) => errors.push({ file, msg });
const warn = (file, msg) => warnings.push({ file, msg });
const list = (dir, ext) => (existsSync(join(ROOT, dir)) ? readdirSync(join(ROOT, dir)).filter((f) => f.endsWith(ext)).map((f) => `${dir}/${f}`) : []);

const only = process.argv.slice(2).map((f) => relative(ROOT, join(process.cwd(), f)).replace(/\\/g, '/'));
const toolFiles = list('tools', '.yaml');
const trainingFiles = list('training', '.md');
const stray = [...list('tools', ''), ...list('training', '')].filter((f) => !/\.(yaml|md)$/.test(f) && !f.endsWith('.gitkeep'));
for (const f of stray) err(f, 'only .yaml files go in tools/ and .md files in training/');

// schemas in the repo must equal the library's (one source of truth)
for (const [file, schema] of [['schema/tool.schema.json', TOOL_SCHEMA], ['schema/training.schema.json', TRAINING_SCHEMA]]) {
  const p = join(ROOT, file);
  if (!existsSync(p)) err(file, 'missing');
  else if (JSON.stringify(JSON.parse(readFileSync(p, 'utf8'))) !== JSON.stringify(schema)) err(file, 'differs from scripts/lib/community-files.mjs (regenerate both together)');
}

const jobs = JSON.parse(readFileSync(join(ROOT, 'jobs.json'), 'utf8')).jobs.map((j) => j.id);
const toolIds = new Set();
const urls = new Map();
const checkTools = only.length ? toolFiles.filter((f) => only.includes(f)) : toolFiles;

// every tool id is needed for training references, so parse all tool files (report only the selected ones)
for (const f of toolFiles) {
  const text = readFileSync(join(ROOT, f), 'utf8');
  const r = parseToolFile(text, f);
  const report = checkTools.includes(f);
  if (report) for (const p of personalDataIn(text)) err(f, `contains ${p} — public files must not hold personal data`);
  if (!r.ok) {
    if (report) for (const e of r.errors) err(f, `${e.path}: ${e.message}`);
    continue;
  }
  if (toolIds.has(r.value.id)) err(f, `duplicate id ${r.value.id}`);
  toolIds.add(r.value.id);
  const key = r.value.url.replace(/^https:\/\/(www\.)?/, '').replace(/\/+$/, '').toLowerCase();
  if (urls.has(key) && report) warn(f, `same official URL as ${urls.get(key)} (fine for a repository with several entries, otherwise a duplicate)`);
  urls.set(key, f);
}

const checkTraining = only.length ? trainingFiles.filter((f) => only.includes(f)) : trainingFiles;
for (const f of checkTraining) {
  const text = readFileSync(join(ROOT, f), 'utf8');
  const r = parseTrainingFile(text, f, jobs);
  for (const p of personalDataIn(text)) err(f, `contains ${p} — public files must not hold personal data`);
  if (!r.ok) {
    for (const e of r.errors) err(f, `${e.path}: ${e.message}`);
    continue;
  }
  for (const t of r.value.meta.tools) {
    if (toolIds.has(t)) continue;
    const slug = t.replaceAll('_', '-');
    warn(f, `tools: "${t}" has no file in tools/. Expected when that tool is already listed on WonderStack. Add tools/${slug}.yaml when you are suggesting the tool itself.`);
  }
}

const print = (kind, { file, msg }) => (GH ? console.log(`::${kind} file=${file}::${msg.replace(/\n/g, ' ')}`) : console.log(`${kind === 'error' ? '✗' : '!'} ${file}: ${msg}`));
warnings.forEach((w) => print('warning', w));
errors.forEach((e) => print('error', e));
console.log(`\nvalidate: ${checkTools.length} tool file(s), ${checkTraining.length} training file(s) checked · ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
