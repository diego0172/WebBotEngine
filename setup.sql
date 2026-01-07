-- Crear tabla admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario admin (usuario: dchamale, contraseña: Dudimeda1998*)
-- Hash bcrypt: $2b$10$41RMxZnsSmJ7axSW5S9w7OqSGjqlXkzyQa64naIMM2C.XRymozlTu
INSERT INTO admin_users (username, password) 
VALUES ('dchamale', '$2b$10$41RMxZnsSmJ7axSW5S9w7OqSGjqlXkzyQa64naIMM2C.XRymozlTu')
ON CONFLICT (username) DO NOTHING;

-- Verificar
SELECT * FROM admin_users;
SELECT * FROM orders;
