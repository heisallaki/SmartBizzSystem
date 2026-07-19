-- Financials, Reporting, Settings & System:
-- Expenses, Expense Categories, Business/System Settings,
-- Audit Logs, Notifications, Backups, Report Exports

CREATE TABLE expense_categories (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  description   VARCHAR(255) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT uq_expense_categories_name UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE expenses (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  expense_category_id   BIGINT UNSIGNED NOT NULL,
  supplier_id           BIGINT UNSIGNED NULL COMMENT 'optional — set when the expense is a payment to a supplier',
  description           VARCHAR(255) NOT NULL,
  amount                DECIMAL(12,2) NOT NULL,
  expense_date          DATE NOT NULL,
  payment_method        VARCHAR(20) NOT NULL,
  receipt_url           VARCHAR(500) NULL,
  recorded_by           BIGINT UNSIGNED NOT NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_expenses_category FOREIGN KEY (expense_category_id) REFERENCES expense_categories(id),
  CONSTRAINT fk_expenses_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
  CONSTRAINT fk_expenses_user FOREIGN KEY (recorded_by) REFERENCES users(id),
  CONSTRAINT chk_expenses_amount_positive CHECK (amount > 0),
  CONSTRAINT chk_expenses_payment_method CHECK (payment_method IN ('Cash','M-Pesa','Card','Bank Transfer')),

  INDEX idx_expenses_category (expense_category_id),
  INDEX idx_expenses_date (expense_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE business_settings (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  business_name         VARCHAR(150) NOT NULL,
  business_email        VARCHAR(190) NULL,
  business_phone        VARCHAR(30) NULL,
  address_line          VARCHAR(255) NULL,
  city                  VARCHAR(100) NULL,
  county                VARCHAR(100) NULL,
  country               VARCHAR(100) NOT NULL DEFAULT 'Kenya',
  tax_pin               VARCHAR(50) NULL COMMENT 'KRA PIN',
  default_tax_rate      DECIMAL(5,2) NOT NULL DEFAULT 16.00,
  currency_code         VARCHAR(3) NOT NULL DEFAULT 'KES',
  logo_url              VARCHAR(500) NULL,
  receipt_footer_text   VARCHAR(255) NULL,
  updated_by            BIGINT UNSIGNED NULL,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_business_settings_user FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE system_settings (
  setting_key     VARCHAR(100) NOT NULL PRIMARY KEY,
  setting_value   JSON NOT NULL,
  updated_by      BIGINT UNSIGNED NULL,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_system_settings_user FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Key-value on purpose: this backs Settings > Appearance/Notifications/Backup/
-- System — theme mode, density, primary color, notification toggles, backup
-- schedule. That's a lot of small, frequently-changing, loosely-related
-- toggles; rigid columns here would mean a migration every time the
-- Settings UI grows one.

CREATE TABLE audit_logs (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NULL,
  action        VARCHAR(100) NOT NULL COMMENT 'e.g. sale.void, product.delete, user.login',
  entity_type   VARCHAR(50) NOT NULL COMMENT 'e.g. sale, product, customer',
  entity_id     BIGINT UNSIGNED NULL,
  metadata      JSON NULL COMMENT 'before/after values or other context',
  ip_address    VARCHAR(45) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

  INDEX idx_audit_logs_user (user_id),
  INDEX idx_audit_logs_entity (entity_type, entity_id),
  INDEX idx_audit_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE notifications (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  type          VARCHAR(50) NOT NULL COMMENT 'e.g. low_stock, sale_voided, po_received',
  title         VARCHAR(150) NOT NULL,
  message       VARCHAR(500) NOT NULL,
  is_read       TINYINT(1) NOT NULL DEFAULT 0,
  read_at       DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_notifications_user_unread (user_id, is_read),
  INDEX idx_notifications_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE backups (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  file_name         VARCHAR(255) NOT NULL,
  file_size_bytes   BIGINT UNSIGNED NULL,
  storage_path      VARCHAR(500) NOT NULL COMMENT 'e.g. S3 key or local path',
  triggered_by      BIGINT UNSIGNED NULL COMMENT 'NULL = automated/scheduled backup',
  status            VARCHAR(20) NOT NULL DEFAULT 'Completed',
  started_at        DATETIME NOT NULL,
  completed_at      DATETIME NULL,

  CONSTRAINT fk_backups_user FOREIGN KEY (triggered_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_backups_status CHECK (status IN ('Running','Completed','Failed')),

  INDEX idx_backups_status (status),
  INDEX idx_backups_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE report_exports (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  report_type       VARCHAR(50) NOT NULL COMMENT 'e.g. sales, inventory, customers, overview',
  format            VARCHAR(10) NOT NULL,
  date_filter       VARCHAR(20) NOT NULL,
  range_start       DATE NULL,
  range_end         DATE NULL,
  generated_by      BIGINT UNSIGNED NOT NULL,
  generated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_report_exports_user FOREIGN KEY (generated_by) REFERENCES users(id),
  CONSTRAINT chk_report_exports_format CHECK (format IN ('pdf','excel','print')),

  INDEX idx_report_exports_user (generated_by),
  INDEX idx_report_exports_generated_at (generated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;