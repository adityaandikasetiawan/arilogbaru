import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiBase = process.env.VITE_API_BASE || 'http://localhost:4004';
const targetPath = path.resolve(__dirname, '..', 'data', 'blogs.json');

async function main() {
  try {
    const url = `${apiBase}/api/blogs`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      console.warn(`[generateBlogs] Fetch failed with status ${res.status}`);
      return;
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.warn(`[generateBlogs] Unexpected payload, expected array`);
      return;
    }
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[generateBlogs] Wrote ${data.length} blogs to ${targetPath}`);
  } catch (e) {
    console.warn(`[generateBlogs] Error: ${(e && e.message) || e}`);
  }
}

await main();
