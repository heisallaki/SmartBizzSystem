-- Customers & Sales: Customers, Sales, Sale Items, Payments

CREATE TABLE customers (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_code         VARCHAR(20) NOT NULL COMMENT 'e.g. CUS-1001, matches current app id format',
  first_name            VARCHAR(100) NOT NULL,
  last_name             VARCHAR(100) NOT NULL,
  email                 VARCHAR(190) NULL,
  phone                 VARCHAR(30) NULL,
  company                VARCHAR(150) NULL,
  tax_number            VARCHAR(50) NULL,
  address_line          VARCHAR(255) NULL,
  city                  VARCHAR(100) NULL,
  county                VARCHAR(100) NULL,
  postal_code           VARCHAR(20) NULL,
  country               VARCHAR(100) NOT NULL DEFAULT 'Kenya',
  status                VARCHAR(20) NOT NULL DEFAULT 'Active',
  notes                 TEXT NULL,
  outstanding_balance   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_orders          INT NOT NULL DEFAULT 0 COMMENT 'denormalized running total — see note below',
  total_spent           DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'denormalized running total — see note below',
  last_purchase_at      DATE NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at            DATETIME NULL,

  CONSTRAINT uq_customers_code UNIQUE (customer_code),
  CONSTRAINT chk_customers_status CHECK (status IN ('Active','Inactive')),

  INDEX idx_customers_status (status),
  INDEX idx_customers_city (city),
  FULLTEXT INDEX ft_customers_name (first_name, last_name, company)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sales (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_number    VARCHAR(20) NOT NULL,
  customer_id       BIGINT UNSIGNED NULL COMMENT 'NULL = walk-in customer',
  cashier_id        BIGINT UNSIGNED NOT NULL,
  sale_date         DATE NOT NULL,
  subtotal          DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  discount_total    DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  tax_rate          DECIMAL(5,2) NOT NULL DEFAULT 16.00,
  tax_total         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  grand_total       DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  payment_method    VARCHAR(20) NOT NULL COMMENT 'primary payment method for quick display — see payments table for the full ledger',
  status             VARCHAR(20) NOT NULL DEFAULT 'Completed',
  notes             TEXT NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_sales_invoice UNIQUE (invoice_number),
  CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  CONSTRAINT fk_sales_cashier FOREIGN KEY (cashier_id) REFERENCES users(id),
  CONSTRAINT chk_sales_status CHECK (status IN ('Completed','Pending','Cancelled')),
  CONSTRAINT chk_sales_payment_method CHECK (payment_method IN ('Cash','M-Pesa','Card','Bank Transfer')),
  CONSTRAINT chk_sales_tax_rate CHECK (tax_rate >= 0 AND tax_rate <= 100),
  CONSTRAINT chk_sales_totals_nonneg CHECK (
    subtotal >= 0 AND discount_total >= 0 AND tax_total >= 0 AND grand_total >= 0
  ),

  INDEX idx_sales_customer (customer_id),
  INDEX idx_sales_cashier (cashier_id),
  INDEX idx_sales_date (sale_date),
  INDEX idx_sales_status (status),
  INDEX idx_sales_status_date (status, sale_date) COMMENT 'covers the "completed sales in date range" query Reports runs on every load'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sale_items (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sale_id           BIGINT UNSIGNED NOT NULL,
  product_id        BIGINT UNSIGNED NOT NULL,
  product_name      VARCHAR(200) NOT NULL COMMENT 'snapshot at time of sale — product may later be renamed/deleted',
  sku               VARCHAR(50) NOT NULL COMMENT 'snapshot at time of sale',
  unit_price        DECIMAL(12,2) NOT NULL,
  quantity          INT NOT NULL,
  line_discount     DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  line_total        DECIMAL(12,2) NOT NULL,

  CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  CONSTRAINT fk_sale_items_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT chk_sale_items_qty_positive CHECK (quantity > 0),
  CONSTRAINT chk_sale_items_price_nonneg CHECK (unit_price >= 0 AND line_discount >= 0 AND line_total >= 0),

  INDEX idx_sale_items_sale (sale_id),
  INDEX idx_sale_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE payments (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sale_id           BIGINT UNSIGNED NOT NULL,
  method            VARCHAR(20) NOT NULL,
  amount            DECIMAL(12,2) NOT NULL,
  reference_code    VARCHAR(100) NULL COMMENT 'e.g. M-Pesa transaction code, for reconciliation',
  paid_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_payments_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  CONSTRAINT chk_payments_method CHECK (method IN ('Cash','M-Pesa','Card','Bank Transfer')),
  CONSTRAINT chk_payments_amount_positive CHECK (amount > 0),

  INDEX idx_payments_sale (sale_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;