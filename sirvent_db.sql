-- ============================================
-- BASE DE DATOS: Sirvent Admin
-- Motor: MySQL (XAMPP)
-- ============================================

CREATE DATABASE IF NOT EXISTS sirvent_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sirvent_db;

-- --------------------------------------------
-- 1. PLATAFORMAS (Amazon, TikShop, Aliexpress...)
-- --------------------------------------------
CREATE TABLE platforms (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100)  NOT NULL,
  slug       VARCHAR(50)   NOT NULL UNIQUE,  -- ej: 'amazon', 'tikshop'
  api_key    VARCHAR(255)  DEFAULT NULL,
  activo     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Plataforma inicial para pruebas
INSERT INTO platforms (nombre, slug, activo) VALUES
  ('Amazon', 'amazon', 1);

-- --------------------------------------------
-- 2. PRODUCTOS (inventario central)
-- --------------------------------------------
CREATE TABLE products (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sku          VARCHAR(100)   NOT NULL UNIQUE,
  nombre       VARCHAR(255)   NOT NULL,
  descripcion  TEXT           DEFAULT NULL,
  precio_base  DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  stock_total  INT            NOT NULL DEFAULT 0,
  activo       TINYINT(1)     NOT NULL DEFAULT 1,
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------
-- 3. PRODUCTOS POR PLATAFORMA
--    Un producto puede estar en varias plataformas
--    con distinto precio y stock reservado
-- --------------------------------------------
CREATE TABLE platform_products (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id        INT UNSIGNED  NOT NULL,
  platform_id       INT UNSIGNED  NOT NULL,
  external_id       VARCHAR(255)  NOT NULL,  -- ID del producto en la plataforma
  precio_plataforma DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  stock_reservado   INT           NOT NULL DEFAULT 0,
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_product_platform (product_id, platform_id),
  CONSTRAINT fk_pp_product  FOREIGN KEY (product_id)  REFERENCES products(id)  ON DELETE CASCADE,
  CONSTRAINT fk_pp_platform FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------
-- 4. CLIENTES (centralizados, sin duplicados)
-- --------------------------------------------
CREATE TABLE customers (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(255)  NOT NULL,
  email      VARCHAR(255)  DEFAULT NULL,
  telefono   VARCHAR(30)   DEFAULT NULL,
  direccion  TEXT          DEFAULT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------
-- 5. PEDIDOS
-- --------------------------------------------
CREATE TABLE orders (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  platform_id       INT UNSIGNED   NOT NULL,
  customer_id       INT UNSIGNED   NOT NULL,
  external_order_id VARCHAR(255)   NOT NULL,  -- ID original de la plataforma
  estado            ENUM(
                      'pendiente',
                      'confirmado',
                      'enviado',
                      'entregado',
                      'cancelado'
                    ) NOT NULL DEFAULT 'pendiente',
  total             DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  fecha_pedido      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_external_order (platform_id, external_order_id),
  CONSTRAINT fk_order_platform  FOREIGN KEY (platform_id)  REFERENCES platforms(id),
  CONSTRAINT fk_order_customer  FOREIGN KEY (customer_id)  REFERENCES customers(id)
) ENGINE=InnoDB;

-- --------------------------------------------
-- 6. LÍNEAS DE PEDIDO
-- --------------------------------------------
CREATE TABLE order_items (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id       INT UNSIGNED  NOT NULL,
  product_id     INT UNSIGNED  NOT NULL,
  cantidad       INT           NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal       DECIMAL(10,2) NOT NULL,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_item_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- --------------------------------------------
-- 7. FACTURAS
-- --------------------------------------------
CREATE TABLE invoices (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id        INT UNSIGNED  NOT NULL UNIQUE,
  numero_factura  VARCHAR(50)   NOT NULL UNIQUE,
  total           DECIMAL(10,2) NOT NULL,
  estado          ENUM(
                    'pendiente',
                    'emitida',
                    'pagada',
                    'anulada'
                  ) NOT NULL DEFAULT 'pendiente',
  fecha_emision   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_invoice_order FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- Productos de ejemplo
INSERT INTO products (sku, nombre, precio_base, stock_total) VALUES
  ('PROD-001', 'Producto de prueba A', 29.99, 100),
  ('PROD-002', 'Producto de prueba B', 49.99, 50),
  ('PROD-003', 'Producto de prueba C', 9.99,  200);

-- Vincular productos con Amazon
INSERT INTO platform_products (product_id, platform_id, external_id, precio_plataforma) VALUES
  (1, 1, 'AMZN-A001', 32.99),
  (2, 1, 'AMZN-B002', 54.99),
  (3, 1, 'AMZN-C003', 11.99);

-- Cliente de ejemplo
INSERT INTO customers (nombre, email, telefono, direccion) VALUES
  ('Cliente Test', 'test@ejemplo.com', '+34 600 000 000', 'Calle Ejemplo 1, Valencia');

-- Pedido de ejemplo
INSERT INTO orders (platform_id, customer_id, external_order_id, estado, total, fecha_pedido) VALUES
  (1, 1, 'AMZ-ORDER-00001', 'confirmado', 87.97, NOW());

-- Líneas del pedido
INSERT INTO order_items (order_id, product_id, cantidad, precio_unitario, subtotal) VALUES
  (1, 1, 1, 32.99, 32.99),
  (1, 2, 1, 54.99, 54.99);
