import fs from 'fs';
import path from 'path';

// read the file as text
const content = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

// The file has a variable const resources = { ... };
// Let's extract the substring
const startIndex = content.indexOf('const resources = {');
const endIndex = content.indexOf('};\n\ni18n') + 1; // get the closing brace
let objStr = content.substring(startIndex + 'const resources = '.length, endIndex);

// It's a JS object, let's parse it using Function
const getResources = new Function('return ' + objStr);
const resources = getResources();

const localesDir = path.join(process.cwd(), 'public', 'locales');
if (!fs.existsSync(localesDir)) fs.mkdirSync(localesDir, { recursive: true });

for (const [lang, data] of Object.entries(resources)) {
  const langDir = path.join(localesDir, lang);
  if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });
  fs.writeFileSync(
    path.join(langDir, 'translation.json'),
    JSON.stringify((data as any).translation, null, 2)
  );
  console.log(`Extracted ${lang}`);
}
