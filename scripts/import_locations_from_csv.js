import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.resolve(__dirname, '../public/codepos/full.csv');
const API_URL = 'http://127.0.0.1:4004/api/locations/bulk';

console.log('Script started');

async function importData() {
  try {
    console.log(`Reading CSV from ${CSV_PATH}...`);
    if (!fs.existsSync(CSV_PATH)) {
      throw new Error('File not found: ' + CSV_PATH);
    }
    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n');
    console.log(`Read ${lines.length} lines.`);
    
    const locations = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = line.split(',');
      if (parts.length < 10) continue;
      
      const postal_code = parts[5];
      const subdis_name = parts[6];
      const dis_name = parts[7];
      const city_name = parts[8];
      const prov_name = parts[9];
      
      locations.push({
        zipCode: postal_code,
        district: `${subdis_name}, ${dis_name}`,
        city: city_name,
        province: prov_name
      });
    }
    
    console.log(`Found ${locations.length} valid locations. Starting import...`);
    
    const BATCH_SIZE = 1000;
    for (let i = 0; i < locations.length; i += BATCH_SIZE) {
      const batch = locations.slice(i, i + BATCH_SIZE);
      console.log(`Importing batch ${i} (${batch.length} records)...`);
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locations: batch })
        });
        
        if (!res.ok) {
          console.error(`Batch ${i} failed: ${res.status} ${res.statusText}`);
          const text = await res.text();
          console.error(text);
        } else {
          // const json = await res.json();
          // console.log(`Batch ${i} success.`);
          process.stdout.write('.');
        }
      } catch (e) {
        console.error(`Batch ${i} error:`, e);
      }
    }
    
    console.log('\nImport complete.');
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

importData();
