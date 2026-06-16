const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'products.db');
const db = new Database(dbPath);

async function run() {
  const email = 'admin@admin.com';
  const password = 'admin1234password';
  const role = 'admin';
  const isVerified = 1; // True in SQLite (integer 1)

  console.log(`Creando usuario admin: ${email}...`);

  // Verificar si el email ya existe
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    console.log(`El usuario ${email} ya existe en la base de datos.`);
    db.close();
    return;
  }

  // Hashear contraseña (costo 12)
  const passwordHash = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();

  // Insertar usuario admin
  const stmt = db.prepare(`
    INSERT INTO users (id, email, passwordHash, role, isVerified, verificationToken, resetPasswordToken, resetPasswordExpires)
    VALUES (?, ?, ?, ?, ?, NULL, NULL, NULL)
  `);

  stmt.run(id, email, passwordHash, role, isVerified);

  console.log('¡Usuario administrador creado con éxito!');
  console.log(`Email: ${email}`);
  console.log(`Contraseña: ${password}`);
  db.close();
}

run().catch(err => {
  console.error('Error creando usuario admin:', err);
  db.close();
});
