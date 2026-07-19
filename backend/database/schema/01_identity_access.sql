-- Identity & Access: Users, Roles, Permissions
-- Engine: InnoDB, Charset: utf8mb4

CREATE TABLE roles (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(50) NOT NULL,
  description       VARCHAR(255) NULL,
  is_system_role    TINYINT(1) NOT NULL DEFAULT 0,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_roles_name UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE permissions (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(100) NOT NULL COMMENT 'e.g. sales.void, inventory.edit',
  module        VARCHAR(50) NOT NULL COMMENT 'e.g. sales, inventory, reports',
  description   VARCHAR(255) NULL,

  CONSTRAINT uq_permissions_code UNIQUE (code),

  INDEX idx_permissions_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE role_permissions (
  role_id         BIGINT UNSIGNED NOT NULL,
  permission_id   BIGINT UNSIGNED NOT NULL,

  PRIMARY KEY (role_id, permission_id),

  CONSTRAINT fk_rp_role       FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE users (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id         BIGINT UNSIGNED NOT NULL,
  full_name       VARCHAR(150) NOT NULL,
  email           VARCHAR(190) NOT NULL,
  phone           VARCHAR(30) NULL,
  password_hash   VARCHAR(255) NOT NULL,
  avatar_url      VARCHAR(500) NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'Active',
  last_login_at   DATETIME NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME NULL,

  CONSTRAINT uq_users_email  UNIQUE (email),
  CONSTRAINT fk_users_role   FOREIGN KEY (role_id) REFERENCES roles(id),
  CONSTRAINT chk_users_status CHECK (status IN ('Active','Suspended','Invited')),

  INDEX idx_users_role_id (role_id),
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed the three roles the Settings > Permissions UI already expects.
INSERT INTO roles (name, description, is_system_role) VALUES
  ('Admin', 'Full access to all modules', 1),
  ('Manager', 'Operational access, no system settings', 1),
  ('Cashier', 'Sales and customer-facing access only', 1);