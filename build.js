// build.js — copia i file web sorgente nella cartella www/ usata da Capacitor.
// Eseguito da: npm run build  (vedi package.json)
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const WWW = path.join(ROOT, 'www');

const FILES = ['index.html', 'manifest.json', 'sw.js'];
const DIRS = ['icons'];

// Crea www/ se non esiste
if (!fs.existsSync(WWW)) fs.mkdirSync(WWW, { recursive: true });

// Pulisce www/
for (const entry of fs.readdirSync(WWW)) {
  fs.rmSync(path.join(WWW, entry), { recursive: true, force: true });
}

// Copia singoli file
for (const f of FILES) {
  const src = path.join(ROOT, f);
  const dst = path.join(WWW, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log('✓', f);
  } else {
    console.warn('⚠ skipped (not found):', f);
  }
}

// Copia cartelle (ricorsive)
function copyDir(src, dst) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
for (const d of DIRS) {
  copyDir(path.join(ROOT, d), path.join(WWW, d));
  console.log('✓', d + '/');
}

console.log('\nBuild completo. Esegui `npx cap sync android` per sincronizzare nel progetto Android.');
