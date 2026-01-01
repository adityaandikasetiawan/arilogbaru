
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

async function checkDb() {
  const dbPath = path.resolve('/var/www/html/arilogbaru/data/airlog.sqlite');
  if (!fs.existsSync(dbPath)) {
    console.log('DB not found');
    return;
  }
  const filebuffer = fs.readFileSync(dbPath);
  const SQL = await initSqlJs();
  const db = new SQL.Database(new Uint8Array(filebuffer));

  const tables = ['services', 'banners', 'testimonials', 'users', 'shipments'];
  for (const table of tables) {
    try {
      const rows = db.exec(`SELECT * FROM ${table}`);
      if (rows.length > 0) {
        const cols = rows[0].columns;
        const values = rows[0].values;
        for (const row of values) {
            const rowObj = {};
            cols.forEach((col, i) => rowObj[col] = row[i]);
            const str = JSON.stringify(rowObj);
            if (str.includes('http:')) {
                console.log(`Found http: in table ${table}:`, str);
            }
        }
      }
    } catch (e) {
      // ignore
    }
  }
}

checkDb();
