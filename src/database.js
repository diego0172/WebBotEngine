import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Leer .env.production directamente
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
    console.warn('No se pudo leer .env.production');
  }
}

// Usar DATABASE_URL si está disponible
let poolConfig;

if (DATABASE_URL) {
  // DigitalOcean puerto 25060 requiere SSL
  // Remover ?sslmode=require de la URL y manejar SSL en la configuración del Pool
  const dbUrl = DATABASE_URL.replace('?sslmode=require', '');
  
  poolConfig = {
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    application_name: 'botenginecorp',
    statement_timeout: 30000,
    query_timeout: 30000
  };
} else {
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'defaultdb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: false,
    statement_timeout: 30000,
    query_timeout: 30000
  };
}

const pool = new Pool(poolConfig);

// Crear tablas si no existen
export async function initializeDatabase() {
  try {
    // Tabla de productos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        category VARCHAR(100),
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        items JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  }
}

export default pool;
