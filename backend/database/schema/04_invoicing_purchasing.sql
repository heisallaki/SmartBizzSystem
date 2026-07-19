-- Invoicing & Purchasing: Invoices, Invoice Items, Purchase Orders, Purchase Order Items

CREATE TABLE invoices (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_number    VARCHAR(20) NOT NULL,
  sale_id           BIGINT UNSIGNED NULL COMMENT 'linked POS sale, if generated from one — NULL for standalone B2B invoices',
  customer_id       BIGINT UNSIGNED NOT NULL,
  issue_date        DATE NOT NULL,
  due_date          DATE NULL,
  subtotal          DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  tax_total         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  grand_total       DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  amount_paid       DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status            VARCHAR(20) NOT NULL DEFAULT 'Unpaid',
  notes             TEXT NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_invoices_number UNIQUE (invoice_number),
  CONSTRAINT fk_invoices_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE SET NULL,
  CONSTRAINT fk_invoices_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT chk_invoices_status CHECK (status IN ('Unpaid','Partially Paid','Paid','Overdue','Void')),
  CONSTRAINT chk_invoices_totals_nonneg CHECK (
    subtotal >= 0 AND tax_total >= 0 AND grand_total >= 0 AND amount_paid >= 0
  ),

  INDEX idx_invoices_customer (customer_id),
  INDEX idx_invoices_sale (sale_id),
  INDEX idx_invoices_status (status),
  INDEX idx_invoices_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE invoice_items (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_id        BIGINT UNSIGNED NOT NULL,
  product_id        BIGINT UNSIGNED NULL COMMENT 'NULL for non-inventory line items — services, fees',
  description       VARCHAR(255) NOT NULL,
  quantity          INT NOT NULL DEFAULT 1,
  unit_price        DECIMAL(12,2) NOT NULL,
  line_total        DECIMAL(12,2) NOT NULL,

  CONSTRAINT fk_invoice_items_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  CONSTRAINT fk_invoice_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  CONSTRAINT chk_invoice_items_qty_positive CHECK (quantity > 0),
  CONSTRAINT chk_invoice_items_nonneg CHECK (unit_price >= 0 AND line_total >= 0),

  INDEX idx_invoice_items_invoice (invoice_id),
  INDEX idx_invoice_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE purchase_orders (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  po_number         VARCHAR(20) NOT NULL,
  supplier_id       BIGINT UNSIGNED NOT NULL,
  status            VARCHAR(20) NOT NULL DEFAULT 'Draft',
  order_date        DATE NOT NULL,
  expected_date     DATE NULL,
  received_date     DATE NULL,
  subtotal          DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  tax_total         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  grand_total       DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  notes             TEXT NULL,
  created_by        BIGINT UNSIGNED NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_purchase_orders_number UNIQUE (po_number),
  CONSTRAINT fk_po_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  CONSTRAINT fk_po_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_po_status CHECK (
    status IN ('Draft','Submitted','Approved','Received','Partially Received','Cancelled')
  ),
  CONSTRAINT chk_po_totals_nonneg CHECK (subtotal >= 0 AND tax_total >= 0 AND grand_total >= 0),

  INDEX idx_po_supplier (supplier_id),
  INDEX idx_po_status (status),
  INDEX idx_po_order_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE purchase_order_items (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  purchase_order_id     BIGINT UNSIGNED NOT NULL,
  product_id            BIGINT UNSIGNED NOT NULL,
  quantity_ordered      INT NOT NULL,
  quantity_received     INT NOT NULL DEFAULT 0,
  unit_cost             DECIMAL(12,2) NOT NULL,
  line_total            DECIMAL(12,2) NOT NULL,

  CONSTRAINT fk_poi_po FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_poi_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT chk_poi_qty_ordered_positive CHECK (quantity_ordered > 0),
  CONSTRAINT chk_poi_qty_received_nonneg CHECK (quantity_received >= 0),
  CONSTRAINT chk_poi_qty_received_le_ordered CHECK (quantity_received <= quantity_ordered),
  CONSTRAINT chk_poi_cost_nonneg CHECK (unit_cost >= 0 AND line_total >= 0),

  INDEX idx_poi_po (purchase_order_id),
  INDEX idx_poi_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;