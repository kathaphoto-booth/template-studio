import fs from 'fs';
const data = fs.readFileSync('lib/templates.ts', 'utf8');
const count = (data.match(/id:\s*"[^"]+"/g) || []).length;
console.log(count);
