import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Intentar cargar .env.production primero, luego .env
const prodEnvFile = path.join(__dirname, '..', '.env.production');
const devEnvFile = path.join(__dirname, '..', '.env');

// Cargar .env.production si existe, si no, .env
try {
  dotenv.config({ path: prodEnvFile });
} catch (err) {
  dotenv.config({ path: devEnvFile });
}

// Usar DATABASE_URL si está disponible, si no, construir desde variables individuales
let poolConfig;

if (process.env.DATABASE_URL) {
  // DigitalOcean puerto 25060 requiere SSL
  // Remover ?sslmode=require de la URL y manejar SSL en la configuración del Pool
  const dbUrl = process.env.DATABASE_URL.replace('?sslmode=require', '');
  
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
