import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const root = '/Users/jedg./Desktop/kat_ha_pb/photobooth-template-studio';

const filesToUpdate = [
  'app/admin/[id]/StatusPipeline.tsx',
  'app/admin/[id]/page.tsx',
  'app/admin/[id]/SendPreview.tsx',
  'app/admin/layout.tsx',
  'app/admin/page.tsx',
  'app/api/admin/notify/route.ts',
  'app/api/inquiry/route.ts',
  'app/api/selection/route.ts',
  'app/globals.css'
];

filesToUpdate.forEach(file => {
  const filePath = join(root, file);
  try {
    let content = readFileSync(filePath, 'utf8');
    
    // Replace Fraunces -> Playfair Display
    content = content.replace(/'Fraunces'/g, "'Playfair Display'");
    content = content.replace(/"Fraunces"/g, '"Playfair Display"');
    
    // Replace EB Garamond -> Hanken Grotesk
    content = content.replace(/'EB Garamond'/g, "'Hanken Grotesk'");
    content = content.replace(/"EB Garamond"/g, '"Hanken Grotesk"');
    
    // Update the comment in globals.css if present
    content = content.replace(/Fraunces \+ EB Garamond stay imported in lib\/fonts\.ts and are retained ONLY for the/g, 'Playfair Display + Hanken Grotesk stay imported in lib/fonts.ts and are retained ONLY for the');
    
    writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  } catch (err) {
    console.error(`Failed to update ${file}:`, err.message);
  }
});
