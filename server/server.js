import express from 'express'
import cors from 'cors'
import initSqlJs from 'sql.js'
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import multer from 'multer'
import sharp from 'sharp'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'
import { Readable } from 'node:stream'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const DATA_DIR = path.join(PROJECT_ROOT, 'data')
const UPLOADS_DIR = path.join(PROJECT_ROOT, 'uploads')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

const DB_PATH = path.join(DATA_DIR, 'airlog.sqlite')
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex')
const ADMIN_PASSWORD_INIT = process.env.ADMIN_PASSWORD_INIT || 'admin123'

const SQL = await initSqlJs()
let db
if (fs.existsSync(DB_PATH)) {
  const filebuffer = fs.readFileSync(DB_PATH)
  db = new SQL.Database(new Uint8Array(filebuffer))
} else {
  db = new SQL.Database()
}

// Debounce saveDb to prevent blocking loop
let saveTimeout = null
function saveDb() {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(async () => {
    try {
      const data = db.export()
      const tempPath = `${DB_PATH}.tmp`
      await fsPromises.writeFile(tempPath, Buffer.from(data))
      await fsPromises.rename(tempPath, DB_PATH)
      console.log('Database persisted async')
    } catch (e) {
      console.error('Failed to save DB async:', e)
    }
  }, 1000)
}

function saveDbSafe() {
  try {
    saveDb()
    return true
  } catch (e) {
    console.error('Persist DB failed:', e)
    return false
  }
}

function getTableColumns(table) {
  const rows = execAll(`PRAGMA table_info(${table})`)
  return rows.map(r => r.name)
}

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex')
}

function isAllowedImageHost(host) {
  return ['images.unsplash.com', 'plus.unsplash.com', 'source.unsplash.com'].includes(host)
}

function proxifyImage(url) {
  try {
    const u = new URL(String(url || ''))
    if (u.protocol !== 'https:' || !isAllowedImageHost(u.hostname)) return url
    if (!u.searchParams.has('w')) u.searchParams.set('w', '1080')
    return `/proxy-image?src=${encodeURIComponent(u.toString())}`
  } catch {
    return url
  }
}

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS shipments (
      id TEXT PRIMARY KEY,
      trackingNumber TEXT,
      customer TEXT,
      origin TEXT,
      destination TEXT,
      weight REAL,
      status TEXT,
      courier TEXT,
      createdDate TEXT,
      estimatedDelivery TEXT,
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      company TEXT,
      message TEXT,
      date TEXT,
      status TEXT
    );
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      icon TEXT,
      photo TEXT
    );
    CREATE TABLE IF NOT EXISTS rates (
      id TEXT PRIMARY KEY,
      origin TEXT,
      destination TEXT,
      ratePerKg REAL,
      volumetricRate REAL,
      eta TEXT
    );
    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      ord INTEGER,
      title TEXT,
      subtitle TEXT,
      ctaLink TEXT,
      imageUrl TEXT,
      isActive INTEGER
    );
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      name TEXT,
      company TEXT,
      photo TEXT,
      message TEXT,
      rating INTEGER
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      role TEXT,
      permissions TEXT,
      lastActive TEXT,
      status TEXT
    );
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT,
      slug TEXT,
      imageUrl TEXT,
      category TEXT,
      author TEXT,
      date TEXT,
      readTime TEXT,
      featured INTEGER,
      content TEXT
    );
    CREATE TABLE IF NOT EXISTS vendors (
      id TEXT PRIMARY KEY,
      name TEXT,
      type TEXT,
      contactInfo TEXT,
      status TEXT
    );
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zipCode TEXT,
      district TEXT,
      city TEXT,
      province TEXT
    );
  `)

  try {
    db.exec('ALTER TABLE shipments ADD COLUMN vendorId TEXT')
  } catch (e) {}

  try {
    db.exec('ALTER TABLE shipments ADD COLUMN description TEXT')
  } catch (e) {}

  try {
    db.exec('ALTER TABLE shipments ADD COLUMN sender TEXT')
  } catch (e) {}

  try {
    db.exec('ALTER TABLE shipments ADD COLUMN coli INTEGER')
  } catch (e) {}

  try {
    db.exec('ALTER TABLE shipments ADD COLUMN insurance TEXT')
  } catch (e) {}

  try {
    db.exec('ALTER TABLE shipments ADD COLUMN packing TEXT')
  } catch (e) {}

  try {
    db.exec('ALTER TABLE shipments ADD COLUMN service TEXT')
  } catch (e) {}

  try {
    db.exec('UPDATE shipments SET service = courier WHERE (service IS NULL OR service = "") AND courier IS NOT NULL')
  } catch (e) {}

  try {
    db.exec('ALTER TABLE users ADD COLUMN passwordHash TEXT')
  } catch (e) {}

  try {
    db.exec('ALTER TABLE blogs ADD COLUMN slug TEXT')
  } catch (e) {}

  try {
    // Migrate existing blogs: set slug = id or title-based if empty
    const blogs = execAll('SELECT id, title, slug FROM blogs WHERE slug IS NULL OR slug = ""')
    const updateStmt = db.prepare('UPDATE blogs SET slug = ? WHERE id = ?')
    for (const b of blogs) {
      const slug = b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || b.id
      updateStmt.run([slug, b.id])
    }
    updateStmt.free()
  } catch (e) {}

  try {
    db.exec('ALTER TABLE testimonials ADD COLUMN isActive INTEGER')
  } catch (e) {}

  try {
    db.exec('UPDATE testimonials SET isActive = 1 WHERE isActive IS NULL')
  } catch (e) {}

  const count = db.exec('SELECT COUNT(1) as c FROM shipments')
  const hasShipments = count[0]?.values?.[0]?.[0] || 0
  if (!hasShipments) {
    const stmt = db.prepare(
      'INSERT INTO shipments (id, trackingNumber, customer, origin, destination, weight, status, courier, createdDate, estimatedDelivery, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run(['1', 'LGX001', 'PT. Maju Jaya', 'Jakarta', 'Surabaya', 25, 'In Transit', 'John Doe', '2024-11-26', '2024-11-29', 'Fragile items'])
    stmt.run(['2', 'LGX002', 'CV. Sentosa', 'Bandung', 'Medan', 10, 'Delivered', 'Jane Smith', '2024-11-25', '2024-11-28', 'Standard shipping'])
    stmt.run(['3', 'LGX003', 'PT. Global Tech', 'Surabaya', 'Jakarta', 50, 'Picked Up', 'Mike Ross', '2024-11-27', '2024-11-30', 'Express delivery'])
    stmt.free()
  }

  const countInq = db.exec('SELECT COUNT(1) as c FROM inquiries')
  const hasInquiries = countInq[0]?.values?.[0]?.[0] || 0
  if (!hasInquiries) {
    const stmt = db.prepare(
      'INSERT INTO inquiries (name, email, phone, company, message, date, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run(['Ahmad Wijaya', 'ahmad@example.com', '08123456789', 'PT. Sinergi', 'I need a quote for bulk shipping.', '2024-11-27', 'new'])
    stmt.run(['Siti Nurhaliza', 'siti@example.com', '08198765432', 'CV. Abadi', 'Do you ship to remote islands?', '2024-11-26', 'reviewed'])
    stmt.free()
  }

  const countSvc = db.exec('SELECT COUNT(1) as c FROM services')
  const hasServices = countSvc[0]?.values?.[0]?.[0] || 0
  if (!hasServices) {
    const stmt = db.prepare(
      'INSERT INTO services (id, title, description, icon, photo) VALUES (?, ?, ?, ?, ?)'
    )
    stmt.run(['1', 'General Cargo Handling', 'Penanganan kargo umum dengan sistem yang efisien dan aman untuk berbagai jenis barang.', 'Package', 'https://images.unsplash.com/photo-1553413077-190dd305871c'])
    stmt.run(['2', 'Oil & Gas Spare Parts', 'Spesialisasi pengiriman spare parts untuk industri minyak dan gas dengan penanganan khusus.', 'Droplet', 'https://images.unsplash.com/photo-1553413077-190dd305871c'])
    stmt.run(['3', 'Storage & Distribution', 'Fasilitas gudang modern dengan sistem manajemen inventori terintegrasi.', 'Warehouse', 'https://images.unsplash.com/photo-1553413077-190dd305871c'])
    stmt.run(['4', 'Telecom Spare Parts', 'Pengiriman komponen telekomunikasi dengan jaminan keamanan dan kecepatan.', 'Radio', 'https://images.unsplash.com/photo-1553413077-190dd305871c'])
    stmt.run(['5', 'Small Package Delivery', 'Layanan pengiriman paket kecil door-to-door yang cepat dan terpercaya.', 'ShoppingBag', 'https://images.unsplash.com/photo-1553413077-190dd305871c'])
    stmt.run(['6', 'E-commerce Fulfillment', 'Solusi lengkap untuk kebutuhan fulfillment bisnis e-commerce Anda.', 'Truck', 'https://images.unsplash.com/photo-1553413077-190dd305871c'])
    stmt.free()
  }

  const countRates = db.exec('SELECT COUNT(1) as c FROM rates')
  const hasRates = countRates[0]?.values?.[0]?.[0] || 0
  if (!hasRates) {
    const stmt = db.prepare(
      'INSERT INTO rates (id, origin, destination, ratePerKg, volumetricRate, eta) VALUES (?, ?, ?, ?, ?, ?)'
    )
    stmt.run(['1', 'Jakarta', 'Surabaya', 10000, 5000, '2-3 days'])
    stmt.run(['2', 'Jakarta', 'Bandung', 8000, 4000, '1-2 days'])
    stmt.run(['3', 'Surabaya', 'Medan', 15000, 7000, '3-4 days'])
    stmt.free()
  }

  const countLocations = db.exec('SELECT COUNT(1) as c FROM locations')
  const hasLocations = countLocations[0]?.values?.[0]?.[0] || 0
  if (!hasLocations) {
    const stmt = db.prepare('INSERT INTO locations (zipCode, district, city, province) VALUES (?, ?, ?, ?)')
    // Sample dataset (can be expanded)
    stmt.run(['10110', 'Gambir', 'Jakarta Pusat', 'DKI Jakarta'])
    stmt.run(['10270', 'Kebayoran Baru', 'Jakarta Selatan', 'DKI Jakarta'])
    stmt.run(['10310', 'Menteng', 'Jakarta Pusat', 'DKI Jakarta'])
    stmt.run(['20111', 'Medan Kota', 'Medan', 'Sumatera Utara'])
    stmt.run(['40111', 'Cibeunying', 'Bandung', 'Jawa Barat'])
    stmt.run(['50139', 'Semarang Tengah', 'Semarang', 'Jawa Tengah'])
    stmt.run(['60241', 'Gubeng', 'Surabaya', 'Jawa Timur'])
    stmt.run(['70111', 'Ilir Timur I', 'Palembang', 'Sumatera Selatan'])
    stmt.run(['90111', 'Ujung Pandang', 'Makassar', 'Sulawesi Selatan'])
    stmt.run(['15111', 'Karawaci', 'Tangerang', 'Banten'])
    stmt.run(['16411', 'Sukmajaya', 'Depok', 'Jawa Barat'])
    stmt.run(['17121', 'Bekasi Selatan', 'Bekasi', 'Jawa Barat'])
    stmt.free()
  }

  const countBanners = db.exec('SELECT COUNT(1) as c FROM banners')
  const hasBanners = countBanners[0]?.values?.[0]?.[0] || 0
  if (!hasBanners) {
    const stmt = db.prepare(
      'INSERT INTO banners (id, ord, title, subtitle, ctaLink, imageUrl, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run(['1', 1, 'Solusi Logistik Terpercaya', 'Pengiriman cepat dan aman ke seluruh Indonesia', '/tracking', 'https://images.unsplash.com/photo-1713859326033-f75e04439c3e', 1])
    stmt.run(['2', 2, 'Pengiriman Internasional', 'Jangkauan global dengan jaringan pelabuhan terluas', '/shipping-rate', 'https://images.unsplash.com/photo-1672870152741-e526cfe5419b', 1])
    stmt.run(['3', 3, 'Gudang & Distribusi', 'Fasilitas penyimpanan modern dengan sistem terintegrasi', '/contact', 'https://images.unsplash.com/photo-1553413077-190dd305871c', 1])
    stmt.run(['4', 4, 'Kargo Udara Express', 'Pengiriman kilat untuk kebutuhan mendesak Anda', '/tracking', 'https://images.unsplash.com/photo-1571086291540-b137111fa1c7', 1])
    stmt.run(['5', 5, 'Kontainer & Kargo Besar', 'Layanan full container untuk kebutuhan industri', '/shipping-rate', 'https://images.unsplash.com/photo-1561702469-c4239ced3f47', 1])
    stmt.free()
  }

  const countTesti = db.exec('SELECT COUNT(1) as c FROM testimonials')
  const hasTesti = countTesti[0]?.values?.[0]?.[0] || 0
  if (!hasTesti) {
    const stmt = db.prepare(
      'INSERT INTO testimonials (id, name, company, photo, message, rating, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run(['1', 'Budi Santoso', 'PT. Maju Jaya', 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f', 'Layanan yang sangat profesional dan cepat. Pengiriman spare parts kami selalu tepat waktu dan dalam kondisi sempurna.', 5, 1])
    stmt.run(['2', 'Siti Nurhaliza', 'CV. Sentosa', 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f', 'Sudah 3 tahun kami menggunakan jasa mereka untuk e-commerce fulfillment. Sistem tracking yang real-time sangat membantu bisnis kami.', 5, 1])
    stmt.free()
  }

  const countBlogs = db.exec('SELECT COUNT(1) as c FROM blogs')
  const hasBlogs = countBlogs[0]?.values?.[0]?.[0] || 0
  if (!hasBlogs) {
    const stmt = db.prepare(
      'INSERT INTO blogs (id, title, slug, imageUrl, category, author, date, readTime, featured, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run(['1', 'Teknologi AI dalam Dunia Logistik Modern', 'teknologi-ai-dalam-dunia-logistik-modern', 'https://images.unsplash.com/photo-1761195696590-3490ea770aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'Teknologi', 'Ahmad Wijaya', '15 Des 2024', '5 menit', 1, 'Konten lengkap artikel AI'])
    stmt.run(['2', 'Tips Mengemas Paket agar Aman Saat Pengiriman', 'tips-mengemas-paket-agar-aman', 'https://images.unsplash.com/photo-1755606396356-bdd7cd95df75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'Tips & Trik', 'Siti Nurhaliza', '12 Des 2024', '4 menit', 1, 'Konten lengkap tips mengemas'])
    stmt.run(['3', 'Tren E-Commerce dan Dampaknya pada Logistik', 'tren-e-commerce-dan-dampaknya', 'https://images.unsplash.com/photo-1627309366653-2dedc084cdf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'Industri', 'Budi Santoso', '10 Des 2024', '6 menit', 0, 'Konten lengkap tren e-commerce'])
    stmt.free()
  }
  const countUsers = db.exec('SELECT COUNT(1) as c FROM users')
  const hasUsers = countUsers[0]?.values?.[0]?.[0] || 0
  if (!hasUsers) {
    const stmt = db.prepare(
      'INSERT INTO users (id, name, email, role, permissions, lastActive, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run(['1', 'John Doe', 'john@logistics.com', 'Super Admin', JSON.stringify(['All Access']), '2024-11-27 14:30', 'active'])
    stmt.run(['2', 'Jane Smith', 'jane@logistics.com', 'Admin', JSON.stringify(['Shipments', 'Rates', 'Inquiries']), '2024-11-27 10:15', 'active'])
    stmt.run(['3', 'Bob Wilson', 'bob@logistics.com', 'Operator', JSON.stringify(['Shipments', 'View Only']), '2024-11-26 16:45', 'active'])
    stmt.free()
  }

  const defaultHash = sha256(ADMIN_PASSWORD_INIT)
  const upd = db.prepare('UPDATE users SET passwordHash = ? WHERE passwordHash IS NULL')
  upd.run([defaultHash])
  upd.free()

  const adminExists = execAll('SELECT id FROM users WHERE email = ? LIMIT 1', ['admin']).length > 0
  if (!adminExists) {
    const adminPwd = sha256(ADMIN_PASSWORD_INIT)
    const stmt = db.prepare(
      'INSERT INTO users (id, name, email, role, permissions, lastActive, status, passwordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run([
      'admin',
      'Administrator',
      'admin',
      'Super Admin',
      JSON.stringify(['All Access']),
      new Date().toISOString().slice(0, 16).replace('T', ' '),
      'active',
      adminPwd
    ])
    stmt.free()
  }

  saveDb()
}

function execAll(sql, params = []) {
  const stmt = db.prepare(sql)
  if (params.length > 0) stmt.bind(params)
  const res = []
  while (stmt.step()) {
    res.push(stmt.getAsObject())
  }
  stmt.free()
  return res
}

initDb()

const app = express()
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'data:', 'https:', 'https://images.unsplash.com', 'https://plus.unsplash.com', 'https://source.unsplash.com']
    }
  }
}))
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.get('/proxy-image', async (req, res) => {
  try {
    const src = String(req.query.src || '')
    const u = new URL(src)
    if (u.protocol !== 'https:' || !isAllowedImageHost(u.hostname)) {
      return res.status(400).json({ error: 'invalid_src' })
    }
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const resp = await fetch(src, { signal: controller.signal })
    clearTimeout(timeout)
    if (!resp.ok) {
      return res.status(502).json({ error: 'fetch_failed' })
    }
    const ct = resp.headers.get('content-type') || ''
    if (!ct.startsWith('image/')) {
      return res.status(400).json({ error: 'not_image' })
    }
    res.set('Content-Type', 'image/webp')
    res.set('Cache-Control', 'public, max-age=86400')
    if (resp.body && typeof Readable.fromWeb === 'function') {
      return Readable.fromWeb(resp.body).pipe(sharp().webp({ quality: 80 })).pipe(res)
    }
    const buf = Buffer.from(await resp.arrayBuffer())
    const out = await sharp(buf).webp({ quality: 80 }).toBuffer()
    return res.send(out)
  } catch (e) {
    return res.status(500).json({ error: 'proxy_error' })
  }
})

// Serve uploads statically
app.use('/uploads', express.static(UPLOADS_DIR))

// File Upload Setup
const upload = multer({ storage: multer.memoryStorage() })

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  
  try {
    const maxSize = 5 * 1024 * 1024
    const typeOk = String(req.file.mimetype || '').startsWith('image/')
    if (!typeOk) return res.status(400).json({ error: 'invalid_type' })
    if ((req.file.size || 0) > maxSize) return res.status(413).json({ error: 'too_large' })
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`
    const filepath = path.join(UPLOADS_DIR, filename)
    
    await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toFile(filepath)
      
    res.json({ url: `/uploads/${filename}` })
  } catch (e) {
    console.error('Upload error:', e)
    res.status(500).json({ error: 'upload_failed', detail: String(e) })
  }
})

// Auth
const sessions = new Map()

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'invalid_payload' })
  try {
    const rows = execAll('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    if (rows.length === 0) return res.status(401).json({ error: 'invalid_credentials' })
    const user = rows[0]
    if (user.status !== 'active') return res.status(403).json({ error: 'user_inactive' })
    const ok = (user.passwordHash || '') === sha256(password)
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' })

    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    db.run('UPDATE users SET lastActive = ? WHERE id = ?', [now, user.id])
    saveDbSafe()
    user.lastActive = now

    const token = crypto.randomBytes(24).toString('hex')
    sessions.set(token, { userId: user.id, issuedAt: Date.now() })
    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: JSON.parse(user.permissions || '[]'),
      lastActive: user.lastActive,
      status: user.status
    }
    res.json({ token, user: publicUser })
  } catch (e) {
    console.error('Login error:', e)
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.get('/api/auth/me', (req, res) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token || !sessions.has(token)) return res.status(401).json({ error: 'unauthorized' })
  const session = sessions.get(token)
  try {
    const rows = execAll('SELECT * FROM users WHERE id = ? LIMIT 1', [session.userId]).map(r => ({
      ...r,
      permissions: JSON.parse(r.permissions || '[]')
    }))
    if (rows.length === 0) return res.status(401).json({ error: 'unauthorized' })
    const { passwordHash, ...user } = rows[0]
    res.json({ user })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.post('/api/auth/logout', (req, res) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (token) sessions.delete(token)
  res.json({ ok: true })
})

// Shipments
app.get('/api/shipments', (req, res) => {
  const rows = execAll('SELECT * FROM shipments ORDER BY createdDate DESC')
  res.json(rows)
})

app.post('/api/shipments', (req, res) => {
  let { id, trackingNumber, customer, origin, destination, weight, status, service, courier, vendorId, createdDate, estimatedDelivery, notes, description, sender, coli, insurance, packing } = req.body || {}
  if (!id) id = crypto.randomUUID()
  if (!trackingNumber) {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '')
    const randomStr = crypto.randomBytes(2).toString('hex').toUpperCase()
    trackingNumber = `AIR${dateStr}${randomStr}`
  }
  if (!customer || !origin || !destination || !(Number(weight) > 0)) {
    return res.status(400).json({ error: 'invalid_payload' })
  }
  if (!status) status = 'Created'
  if (!createdDate) createdDate = new Date().toISOString().slice(0, 10)
  const svc = String(service || courier || 'Reguler')
  const cour = String(courier || service || svc)

  try {
    const available = getTableColumns('shipments')
    const allCols = ['id','trackingNumber','customer','origin','destination','weight','status','service','courier','vendorId','createdDate','estimatedDelivery','notes','description','sender','coli','insurance','packing']
    const cols = allCols.filter(c => available.includes(c))
    const values = {
      id: id || crypto.randomUUID(),
      trackingNumber: String(trackingNumber || ''),
      customer: String(customer || ''),
      origin: String(origin || ''),
      destination: String(destination || ''),
      weight: Number(weight) || 0,
      status: String(status || ''),
      service: svc,
      courier: cour,
      vendorId: vendorId ?? null,
      createdDate: String(createdDate || ''),
      estimatedDelivery: String(estimatedDelivery || ''),
      notes: String(notes || ''),
      description: String(description || ''),
      sender: String(sender || ''),
      coli: Number(coli) || 0,
      insurance: String(insurance || ''),
      packing: String(packing || '')
    }
    const placeholders = cols.map(() => '?').join(', ')
    const sql = `INSERT INTO shipments (${cols.join(', ')}) VALUES (${placeholders})`
    const stmt = db.prepare(sql)
    stmt.run(cols.map(c => values[c]))
    stmt.free()
    const persisted = saveDbSafe()
    res.status(201).json({ ok: true, persisted })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.put('/api/shipments/:id', (req, res) => {
  const { id } = req.params
  const { trackingNumber, customer, origin, destination, weight, status, service, courier, vendorId, createdDate, estimatedDelivery, notes, description, sender, coli, insurance, packing } = req.body || {}
  try {
    const available = getTableColumns('shipments')
    const allUpdatable = ['trackingNumber','customer','origin','destination','weight','status','service','courier','vendorId','createdDate','estimatedDelivery','notes','description','sender','coli','insurance','packing']
    const cols = allUpdatable.filter(c => available.includes(c))
    const map = {
      trackingNumber: String(trackingNumber || ''),
      customer: String(customer || ''),
      origin: String(origin || ''),
      destination: String(destination || ''),
      weight: Number(weight) || 0,
      status: String(status || ''),
      service: String(service || courier || ''),
      courier: String(courier || service || ''),
      vendorId: vendorId ?? null,
      createdDate: String(createdDate || ''),
      estimatedDelivery: String(estimatedDelivery || ''),
      notes: String(notes || ''),
      description: String(description || ''),
      sender: String(sender || ''),
      coli: Number(coli) || 0,
      insurance: String(insurance || ''),
      packing: String(packing || '')
    }
    const assigns = cols.map(c => `${c}=?`).join(', ')
    const sql = `UPDATE shipments SET ${assigns} WHERE id=?`
    const stmt = db.prepare(sql)
    stmt.run([...cols.map(c => map[c]), id])
    stmt.free()
    const persisted = saveDbSafe()
    res.json({ ok: true, persisted })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.delete('/api/shipments/:id', (req, res) => {
  const { id } = req.params
  try {
    db.run('DELETE FROM shipments WHERE id = ?', [id])
    const persisted = saveDbSafe()
    res.json({ ok: true, persisted })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

// Vendors
app.get('/api/vendors', (req, res) => {
  const rows = execAll('SELECT * FROM vendors ORDER BY name ASC')
  res.json(rows)
})

app.post('/api/vendors', (req, res) => {
  let { id, name, type, contactInfo, status } = req.body || {}
  if (!id) id = crypto.randomUUID()
  if (!name) return res.status(400).json({ error: 'invalid payload' })

  try {
    const stmt = db.prepare(
      'INSERT INTO vendors (id, name, type, contactInfo, status) VALUES (?, ?, ?, ?, ?)'
    )
    stmt.run([id, name, type, contactInfo, status || 'active'])
    stmt.free()
    saveDb()
    res.status(201).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.put('/api/vendors/:id', (req, res) => {
  const { id } = req.params
  const { name, type, contactInfo, status } = req.body || {}
  
  try {
    const stmt = db.prepare(
      'UPDATE vendors SET name=?, type=?, contactInfo=?, status=? WHERE id=?'
    )
    stmt.run([name, type, contactInfo, status, id])
    stmt.free()
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.delete('/api/vendors/:id', (req, res) => {
  const { id } = req.params
  try {
    db.run('DELETE FROM vendors WHERE id = ?', [id])
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

// Locations
app.get('/api/locations', (req, res) => {
  const { search } = req.query
  let sql = 'SELECT * FROM locations'
  const params = []
  
  if (search) {
    sql += ' WHERE zipCode LIKE ? OR city LIKE ? OR district LIKE ? OR province LIKE ?'
    const term = `%${search}%`
    params.push(term, term, term, term)
  }
  
  sql += ' ORDER BY zipCode ASC LIMIT 20'
  const rows = execAll(sql, params)
  res.json(rows)
})

app.post('/api/locations/bulk', (req, res) => {
  const { locations } = req.body || {}
  if (!Array.isArray(locations) || locations.length === 0) {
    return res.status(400).json({ error: 'invalid_payload' })
  }
  try {
    const stmt = db.prepare('INSERT INTO locations (zipCode, district, city, province) VALUES (?, ?, ?, ?)')
    let count = 0
    db.exec('BEGIN TRANSACTION')
    try {
      for (const loc of locations) {
        const zip = String(loc.zipCode || '').trim()
        const district = String(loc.district || '').trim()
        const city = String(loc.city || '').trim()
        const province = String(loc.province || '').trim()
        if (!zip || !city) continue
        stmt.run([zip, district, city, province])
        count++
      }
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      throw err
    } finally {
      stmt.free()
    }
    const persisted = saveDbSafe()
    res.status(201).json({ ok: true, count, persisted })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.post('/api/locations/import-csv', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no_file' })
  try {
    const text = req.file.buffer.toString('utf-8')
    const lines = text.split(/\r?\n/)
    const rows = []
    for (const line of lines) {
      const cleaned = line.trim()
      if (!cleaned) continue
      const cols = cleaned.split(',').map(s => s.trim())
      if (cols.length < 2) continue
      if (cols[0].toLowerCase().includes('zip') && cols[1].toLowerCase().includes('district')) continue
      const zipCode = cols[0]
      const district = cols[1] || ''
      const city = cols[2] || ''
      const province = cols[3] || ''
      rows.push({ zipCode, district, city, province })
    }
    const stmt = db.prepare('INSERT INTO locations (zipCode, district, city, province) VALUES (?, ?, ?, ?)')
    let count = 0
    db.exec('BEGIN TRANSACTION')
    try {
      for (const r of rows) {
        const zip = String(r.zipCode || '').trim()
        const city = String(r.city || '').trim()
        if (!zip || !city) continue
        stmt.run([zip, String(r.district || '').trim(), city, String(r.province || '').trim()])
        count++
      }
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      throw err
    } finally {
      stmt.free()
    }
    const persisted = saveDbSafe()
    res.status(201).json({ ok: true, count, persisted })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

// Inquiries
app.get('/api/inquiries', (req, res) => {
  const rows = execAll('SELECT * FROM inquiries ORDER BY date DESC')
  res.json(rows)
})

app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, company, message } = req.body || {}
  if (!name || !email || !message) return res.status(400).json({ error: 'invalid payload' })
  
  try {
    const stmt = db.prepare(
      'INSERT INTO inquiries (name, email, phone, company, message, date, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    const date = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    stmt.run([name, email, phone, company, message, date, 'new'])
    stmt.free()
    const persisted = saveDbSafe()
    res.status(201).json({ ok: true, persisted })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

// Services
app.get('/api/services', (req, res) => {
  const rows = execAll('SELECT * FROM services ORDER BY id ASC').map(r => ({
    ...r,
    photo: proxifyImage(r.photo)
  }))
  res.json(rows)
})

// Rates
app.get('/api/rates', (req, res) => {
  const rows = execAll('SELECT * FROM rates ORDER BY origin ASC, destination ASC')
  res.json(rows)
})

// Banners
app.get('/api/banners', (req, res) => {
  const rows = execAll('SELECT * FROM banners ORDER BY ord ASC').map(r => ({
    id: r.id,
    order: r.ord,
    title: r.title,
    subtitle: r.subtitle,
    ctaLink: r.ctaLink,
    imageUrl: proxifyImage(r.imageUrl),
    isActive: !!r.isActive
  }))
  res.json(rows)
})

app.post('/api/banners', (req, res) => {
  const { id, order, title, subtitle, ctaLink, imageUrl, isActive } = req.body || {}
  if (!id || !title) return res.status(400).json({ error: 'invalid payload' })
  try {
    const stmt = db.prepare(
      'INSERT INTO banners (id, ord, title, subtitle, ctaLink, imageUrl, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run([id, order || 99, title, subtitle, ctaLink, imageUrl, isActive ? 1 : 0])
    stmt.free()
    saveDb()
    res.status(201).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.put('/api/banners/:id', (req, res) => {
  const { id } = req.params
  const { order, title, subtitle, ctaLink, imageUrl, isActive } = req.body || {}
  try {
    const stmt = db.prepare(
      'UPDATE banners SET ord=?, title=?, subtitle=?, ctaLink=?, imageUrl=?, isActive=? WHERE id=?'
    )
    stmt.run([order, title, subtitle, ctaLink, imageUrl, isActive ? 1 : 0, id])
    stmt.free()
    const persisted = saveDbSafe()
    res.json({ ok: true, persisted })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.delete('/api/banners/:id', (req, res) => {
  const { id } = req.params
  try {
    db.run('DELETE FROM banners WHERE id = ?', [id])
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

// Reorder banners (batch)
app.post('/api/banners/reorder', (req, res) => {
  const { orders } = req.body || {}
  try {
    const stmt = db.prepare('UPDATE banners SET ord=? WHERE id=?')
    for (const { id, order } of orders || []) {
      stmt.run([order, id])
    }
    stmt.free()
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

// Testimonials
app.get('/api/testimonials', (req, res) => {
  const rows = execAll('SELECT * FROM testimonials ORDER BY id ASC').map(r => ({
    ...r,
    photo: proxifyImage(r.photo),
    isActive: !!r.isActive
  }))
  res.json(rows)
})

app.post('/api/testimonials', (req, res) => {
  const { id, name, company, photo, message, rating, isActive } = req.body || {}
  if (!id || !name) return res.status(400).json({ error: 'invalid payload' })
  try {
    const stmt = db.prepare(
      'INSERT INTO testimonials (id, name, company, photo, message, rating, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run([id, name, company, photo, message, rating, isActive ? 1 : 0])
    stmt.free()
    saveDb()
    res.status(201).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.put('/api/testimonials/:id', (req, res) => {
  const { id } = req.params
  const { name, company, photo, message, rating, isActive } = req.body || {}
  try {
    const stmt = db.prepare(
      'UPDATE testimonials SET name=?, company=?, photo=?, message=?, rating=?, isActive=? WHERE id=?'
    )
    stmt.run([name, company, photo, message, rating, isActive ? 1 : 0, id])
    stmt.free()
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.delete('/api/testimonials/:id', (req, res) => {
  const { id } = req.params
  try {
    db.run('DELETE FROM testimonials WHERE id = ?', [id])
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.get('/api/blogs', (req, res) => {
  const rows = execAll('SELECT * FROM blogs ORDER BY date DESC').map(r => ({
    ...r,
    imageUrl: proxifyImage(r.imageUrl),
    featured: !!r.featured
  }))
  res.json(rows)
})

app.get('/api/blogs/:id', (req, res) => {
  const { id } = req.params
  const rows = execAll('SELECT * FROM blogs WHERE id = ? OR slug = ? LIMIT 1', [id, id]).map(r => ({
    ...r,
    imageUrl: proxifyImage(r.imageUrl),
    featured: !!r.featured
  }))
  if (rows.length === 0) return res.status(404).json({ error: 'not_found' })
  res.json(rows[0])
})

app.post('/api/blogs', (req, res) => {
  const { id, title, slug, imageUrl, category, author, date, readTime, featured, content } = req.body || {}
  if (!id || !title) return res.status(400).json({ error: 'invalid payload' })
  try {
    const stmt = db.prepare(
      'INSERT INTO blogs (id, title, slug, imageUrl, category, author, date, readTime, featured, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run([id, title, slug, imageUrl, category, author, date, readTime, featured ? 1 : 0, content])
    stmt.free()
    saveDb()
    res.status(201).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.put('/api/blogs/:id', (req, res) => {
  const { id } = req.params
  const { title, slug, imageUrl, category, author, date, readTime, featured, content } = req.body || {}
  try {
    const stmt = db.prepare(
      'UPDATE blogs SET title=?, slug=?, imageUrl=?, category=?, author=?, date=?, readTime=?, featured=?, content=? WHERE id=?'
    )
    stmt.run([title, slug, imageUrl, category, author, date, readTime, featured ? 1 : 0, content, id])
    stmt.free()
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.delete('/api/blogs/:id', (req, res) => {
  const { id } = req.params
  try {
    db.run('DELETE FROM blogs WHERE id = ?', [id])
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

// Users
app.get('/api/users', (req, res) => {
  const rows = execAll('SELECT * FROM users ORDER BY name ASC').map(r => {
    const { passwordHash, ...rest } = r
    return {
      ...rest,
      permissions: JSON.parse(rest.permissions || '[]')
    }
  })
  res.json(rows)
})

app.post('/api/users', (req, res) => {
  const { id, name, email, role, permissions, lastActive, status, password } = req.body || {}
  if (!id || !email) return res.status(400).json({ error: 'invalid payload' })
  try {
    if (password && String(password).length < 8) {
      return res.status(400).json({ error: 'weak_password' })
    }
    const pwdHash = password ? sha256(password) : sha256(ADMIN_PASSWORD_INIT)
    const stmt = db.prepare(
      'INSERT INTO users (id, name, email, role, permissions, lastActive, status, passwordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run([id, name, email, role, JSON.stringify(permissions || []), lastActive, status, pwdHash])
    stmt.free()
    saveDb()
    res.status(201).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params
  const { name, email, role, permissions, lastActive, status, password } = req.body || {}
  try {
    if (password) {
      if (String(password).length < 8) {
        return res.status(400).json({ error: 'weak_password' })
      }
      const stmt = db.prepare(
        'UPDATE users SET name=?, email=?, role=?, permissions=?, lastActive=?, status=?, passwordHash=? WHERE id=?'
      )
      stmt.run([name, email, role, JSON.stringify(permissions || []), lastActive, status, sha256(password), id])
      stmt.free()
    } else {
      const stmt = db.prepare(
        'UPDATE users SET name=?, email=?, role=?, permissions=?, lastActive=?, status=? WHERE id=?'
      )
      stmt.run([name, email, role, JSON.stringify(permissions || []), lastActive, status, id])
      stmt.free()
    }
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params
  try {
    db.run('DELETE FROM users WHERE id = ?', [id])
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.post('/api/rates/bulk', (req, res) => {
  const { rates } = req.body || {}
  if (!Array.isArray(rates)) return res.status(400).json({ error: 'invalid payload' })
  
  try {
    const stmt = db.prepare(
      'INSERT INTO rates (id, origin, destination, ratePerKg, volumetricRate, eta) VALUES (?, ?, ?, ?, ?, ?)'
    )
    
    let count = 0
    db.exec('BEGIN TRANSACTION')
    try {
      for (const r of rates) {
        const id = r.id || crypto.randomUUID()
        stmt.run([
          id,
          r.origin || '',
          r.destination || '',
          Number(r.ratePerKg) || 0,
          Number(r.volumetricRate) || 0,
          r.eta || ''
        ])
        count++
      }
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      throw err
    } finally {
      stmt.free()
    }
    
    saveDb()
    res.status(201).json({ ok: true, count })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.post('/api/rates', (req, res) => {
  const { id, origin, destination, ratePerKg, volumetricRate, eta } = req.body || {}
  if (!id || !origin || !destination) return res.status(400).json({ error: 'invalid payload' })
  try {
    const stmt = db.prepare(
      'INSERT INTO rates (id, origin, destination, ratePerKg, volumetricRate, eta) VALUES (?, ?, ?, ?, ?, ?)'
    )
    stmt.run([id, origin, destination, ratePerKg, volumetricRate, eta])
    stmt.free()
    saveDb()
    res.status(201).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.put('/api/rates/:id', (req, res) => {
  const { id } = req.params
  const { origin, destination, ratePerKg, volumetricRate, eta } = req.body || {}
  try {
    const stmt = db.prepare(
      'UPDATE rates SET origin=?, destination=?, ratePerKg=?, volumetricRate=?, eta=? WHERE id=?'
    )
    stmt.run([origin, destination, ratePerKg, volumetricRate, eta, id])
    stmt.free()
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.delete('/api/rates/:id', (req, res) => {
  const { id } = req.params
  try {
    db.run('DELETE FROM rates WHERE id = ?', [id])
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.post('/api/services', (req, res) => {
  const { id, title, description, icon, photo } = req.body || {}
  if (!id || !title) return res.status(400).json({ error: 'invalid payload' })
  try {
    const stmt = db.prepare(
      'INSERT INTO services (id, title, description, icon, photo) VALUES (?, ?, ?, ?, ?)'
    )
    stmt.run([id, title, description, icon, photo])
    stmt.free()
    saveDb()
    res.status(201).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.put('/api/services/:id', (req, res) => {
  const { id } = req.params
  const { title, description, icon, photo } = req.body || {}
  try {
    const stmt = db.prepare(
      'UPDATE services SET title=?, description=?, icon=?, photo=? WHERE id=?'
    )
    stmt.run([title, description, icon, photo, id])
    stmt.free()
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.delete('/api/services/:id', (req, res) => {
  const { id } = req.params
  try {
    db.run('DELETE FROM services WHERE id = ?', [id])
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, company, message, date, status } = req.body || {}
  if (!name || !email) return res.status(400).json({ error: 'invalid payload' })
  try {
    const stmt = db.prepare(
      'INSERT INTO inquiries (name, email, phone, company, message, date, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run([name, email, phone, company, message, date, status])
    stmt.free()
    saveDb()
    res.status(201).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.put('/api/inquiries/:id', (req, res) => {
  const { id } = req.params
  const { name, email, phone, company, message, date, status } = req.body || {}
  try {
    const stmt = db.prepare(
      'UPDATE inquiries SET name=?, email=?, phone=?, company=?, message=?, date=?, status=? WHERE id=?'
    )
    stmt.run([name, email, phone, company, message, date, status, id])
    stmt.free()
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

app.delete('/api/inquiries/:id', (req, res) => {
  const { id } = req.params
  try {
    db.run('DELETE FROM inquiries WHERE id = ?', [id])
    saveDb()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e) })
  }
})

// Admin Migration Endpoint
app.post('/api/admin/migrate', (req, res) => {
  const results = []
  const runMigration = (sql) => {
    try {
      db.exec(sql)
      results.push({ sql, success: true })
    } catch (e) {
      results.push({ sql, success: false, error: String(e) })
    }
  }

  runMigration('ALTER TABLE shipments ADD COLUMN vendorId TEXT')
  runMigration('ALTER TABLE shipments ADD COLUMN description TEXT')
  runMigration('ALTER TABLE shipments ADD COLUMN sender TEXT')
  runMigration('ALTER TABLE shipments ADD COLUMN coli INTEGER')
  runMigration('ALTER TABLE shipments ADD COLUMN insurance TEXT')
  runMigration('ALTER TABLE shipments ADD COLUMN packing TEXT')
  runMigration('ALTER TABLE shipments ADD COLUMN service TEXT')
  
  // Ensure consistency
  try {
    db.exec('UPDATE shipments SET service = courier WHERE (service IS NULL OR service = "") AND courier IS NOT NULL')
    results.push({ sql: 'UPDATE service=courier', success: true })
  } catch (e) {
    results.push({ sql: 'UPDATE service=courier', success: false, error: String(e) })
  }

  const columns = getTableColumns('shipments')
  const persisted = saveDbSafe()
  
  res.json({ ok: true, persisted, migrations: results, columns })
})

// Serve frontend build if available
const DIST_DIR = path.join(PROJECT_ROOT, 'dist')
if (fs.existsSync(DIST_DIR)) {
  app.use((req, res, next) => {
    if (req.url.startsWith('/assets/')) {
      res.set('Cache-Control', 'no-cache')
    }
    next()
  })
  app.use(express.static(DIST_DIR))
  app.get('*', (req, res) => {
    res.set('Cache-Control', 'no-cache')
    res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

const port = process.env.PORT || 4004
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`)
})
