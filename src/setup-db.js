import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Leer DATABASE_URL de .env.production
let DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  try {
    const envFile = path.join(__dirname, '..', '.env.production');
    const envContent = fs.readFileSync(envFile, 'utf8');
    const match = envContent.match(/DATABASE_URL=(.+)/);
    if (match) {
      DATABASE_URL = match[1].trim();
    }
  } catch (err) {
    console.error('No se pudo leer .env.production');
    process.exit(1);
  }
}

const dbUrl = DATABASE_URL.replace('?sslmode=require', '');
const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  try {
    console.log('📦 Creando tabla orders...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        items JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla orders creada');

    console.log('📦 Creando tabla admin_users...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla admin_users creada');

    console.log('👤 Creando usuario admin...');
    const hashedPassword = await bcrypt.hash('Dudimeda1998*', 10);
    
    try {
      await pool.query(
        'INSERT INTO admin_users (username, password) VALUES ($1, $2)',
        ['dchamale', hashedPassword]
      );
      console.log('✅ Usuario admin dchamale creado');
    } catch (err) {
      if (err.code === '23505') {
        console.log('⚠️ Usuario dchamale ya existe');
      } else {
        throw err;
      }
    }

    console.log('✨ Base de datos configurada correctamente');
    await pool.end();
  } catch (error) {
    console.error('❌ Error configurando base de datos:', error);
    process.exit(1);
  }
}

setupDatabase();
