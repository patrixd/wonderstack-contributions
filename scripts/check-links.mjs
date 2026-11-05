#!/usr/bin/env node
/**
 * Checks that the links in tools/ and training/ still work (no dependencies; Node 22+).
 *
 *   node scripts/check-links.mjs --all                 every file (weekly schedule)
 *   node scripts/check-links.mjs --files changed.txt   only the files listed (one path per line; pull requests)
 *
 * HEAD first, GET when a site refuses HEAD; 10 s timeout; 6 at a time; polite User-Agent. 2xx/3xx = ok.
 * 401/403/429 and timeouts are WARNINGS (many sites block bots); 404/410/5xx and DNS errors are ERRORS.
 * Only https links are allowed at all (the schema already refuses http).
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const GH = process.env.GITHUB_ACTIONS === 'true';
const args = process.argv.slice(2);
const listFile = args.includes('--files') ? args[args.indexOf('--files') + 1] : null;
const all = (dir, ext) => (existsSync(join(ROOT, dir)) ? readdirSync(join(ROOT, dir)).filter((f) => f.endsWith(ext)).map((f) => `${dir}/${f}`) : []);
const files = listFile
  ? readFileSync(listFile, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => /^(tools\/.+\.yaml|training\/.+\.md)$/.test(l) && existsSync(join(ROOT, l)))
  : [...all('tools', '.yaml'), ...all('training', '.md')];

const URL_RE = /https:\/\/[^\s"'<>)\]]+/g;
const links = new Map();
for (const f of files) for (const u of readFileSync(join(ROOT, f), 'utf8').match(URL_RE) ?? []) (links.get(u) ?? links.set(u, []).get(u)).push(f);

const UA = 'wonderstack-community-link-check/1.0 (+https://github.com/; contact: maintainers)';
async function probe(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(10_000), headers: { 'User-Agent': UA, Accept: 'text/html,*/*' } });
      if (res.body) await res.body.cancel().catch(() => {});
      if (res.ok) return { ok: true, status: res.status };
      if (method === 'HEAD' && [403, 405, 400, 404, 501].includes(res.status)) continue; // some sites only answer GET
      return { ok: false, status: res.status };
    } catch (e) {
      if (method === 'HEAD') continue;
      return { ok: false, status: 0, error: e?.cause?.code ?? e?.name ?? String(e) };
    }
  }
  return { ok: false, status: 0, error: 'no answer' };
}

const results = [];
const queue = [...links.keys()];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let u = queue.shift(); u; u = queue.shift()) results.push({ url: u, ...(await probe(u)) });
  }),
);

let errors = 0;
let warnings = 0;
for (const r of results.sort((a, b) => a.url.localeCompare(b.url))) {
  if (r.ok) continue;
  const soft = [401, 403, 429].includes(r.status) || r.error === 'TimeoutError';
  const msg = `${r.url} → ${r.status || r.error}`;
  for (const f of links.get(r.url)) {
    if (GH) console.log(`::${soft ? 'warning' : 'error'} file=${f}::${soft ? 'link may block bots' : 'broken link'}: ${msg}`);
    else console.log(`${soft ? '!' : '✗'} ${f}: ${msg}`);
  }
  soft ? warnings++ : errors++;
}
console.log(`\ncheck-links: ${results.length} link(s) in ${files.length} file(s) · ${errors} broken, ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
