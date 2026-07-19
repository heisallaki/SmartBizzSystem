-- Catalog & Inventory: Categories, Suppliers, Products, Stock Movements

CREATE TABLE categories (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name                  VARCHAR(100) NOT NULL,
  description           VARCHAR(255) NULL,
  parent_category_id    BIGINT UNSIGNED NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_categories_name UNIQUE (name),
  CONSTRAINT fk_categories_parent FOREIGN KEY (parent_category_id)
    REFERENCES categories(id) ON DELETE SET NULL,

  INDEX idx_categories_parent (parent_category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE suppliers (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(150) NOT NULL,
  contact_person    VARCHAR(150) NULL,
  email             VARCHAR(190) NULL,
  phone             VARCHAR(30) NULL,
  address_line      VARCHAR(255) NULL,
  city              VARCHAR(100) NULL,
  county            VARCHAR(100) NULL,
  country           VARCHAR(100) NOT NULL DEFAULT 'Kenya',
  tax_number        VARCHAR(50) NULL,
  status            VARCHAR(20) NOT NULL DEFAULT 'Active',
  notes             TEXT NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        DATETIME NULL,

  CONSTRAINT chk_suppliers_status CHECK (status IN ('Active','Inactive')),

  INDEX idx_suppliers_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE products (
  id                     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sku                    VARCHAR(50) NOT NULL,
  name                   VARCHAR(200) NOT NULL,
  category_id            BIGINT UNSIGNED NULL,
  supplier_id            BIGINT UNSIGNED NULL COMMENT 'preferred/default supplier',
  description            TEXT NULL,
  price                  DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  cost_price             DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  stock                  INT NOT NULL DEFAULT 0,
  low_stock_threshold    INT NOT NULL DEFAULT 10,
  status                 VARCHAR(20) NOT NULL DEFAULT 'In Stock' COMMENT 'derived from stock vs threshold, kept denormalized for read speed',
  is_active              TINYINT(1) NOT NULL DEFAULT 1,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at             DATETIME NULL,

  CONSTRAINT uq_products_sku UNIQUE (sku),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
  CONSTRAINT chk_products_status CHECK (status IN ('In Stock','Low Stock','Out of Stock')),
  CONSTRAINT chk_products_stock_nonneg CHECK (stock >= 0),
  CONSTRAINT chk_products_price_nonneg CHECK (price >= 0),
  CONSTRAINT chk_products_cost_nonneg CHECK (cost_price >= 0),

  INDEX idx_products_category (category_id),
  INDEX idx_products_supplier (supplier_id),
  INDEX idx_products_status (status),
  FULLTEXT INDEX ft_products_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE stock_movements (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id        BIGINT UNSIGNED NOT NULL,
  movement_type     VARCHAR(20) NOT NULL,
  quantity_change   INT NOT NULL COMMENT 'positive = stock in, negative = stock out',
  stock_after       INT NOT NULL,
  reference_type    VARCHAR(30) NULL COMMENT 'sale, purchase_order, manual, etc.',
  reference_id      BIGINT UNSIGNED NULL COMMENT 'polymorphic — no FK, since it points at different tables depending on reference_type',
  notes             VARCHAR(255) NULL,
  created_by        BIGINT UNSIGNED NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_stock_movements_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_stock_movements_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_stock_movements_type CHECK (
    movement_type IN ('Sale','Restock','Adjustment','Return','Purchase Order','Void Reversal')
  ),

  INDEX idx_stock_movements_product (product_id),
  INDEX idx_stock_movements_reference (reference_type, reference_id),
  INDEX idx_stock_movements_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;