export const generalSettings = {
  businessName: "SmartBizz Demo",
  businessEmail: "info@smartbizz.com",
  businessPhone: "+254700000000",
  businessAddress: "Nairobi, Kenya",
  businessLogo: "",

  currency: "KES",
  language: "en",
  timezone: "Africa/Nairobi",

  dateFormat: "DD/MM/YYYY",
  numberFormat: "1,234.56",
};

export const appearanceSettings = {
  theme: "system",
  primaryColor: "#009688",
  density: "comfortable",
};

export const securitySettings = {
  profile: {
    firstName: "Admin",
    lastName: "User",
    email: "admin@smartbizz.com",
  },

  sessionTimeout: 30,
  twoFactorAuthentication: false,
  rememberLastWorkspace: true,

  roles: [
    {
      module: "Dashboard",
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    {
      module: "Inventory",
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
    {
      module: "Sales",
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      module: "Customers",
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
    {
      module: "Suppliers",
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
    {
      module: "Reports",
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    {
      module: "Settings",
      view: true,
      create: false,
      edit: true,
      delete: false,
    },
  ],
};

export const notificationSettings = {
  emailNotifications: true,
  systemNotifications: true,
  salesAlerts: true,
  lowStockAlerts: true,
  backupReminders: true,
};

export const businessSettings = {
  taxEnabled: true,
  taxRate: 16,

  invoicePrefix: "INV",
  nextInvoiceNumber: 1001,

  receiptFooter:
    "Thank you for choosing SmartBizz.",

  defaultPaymentMethod: "cash",
  defaultCustomer: "Walk-in Customer",
};

export const backupSettings = {
  autoBackup: false,
  backupFrequency: "weekly",
  lastBackup: null,
};

export const passwordState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const passwordVisibility = {
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
};

export const dialogState = {
  password: false,
  import: false,
  export: false,
  backup: false,
  restore: false,
  reset: false,
};

export const settingsState = {
  loading: false,
  saving: false,
  dirty: false,
};

export default {
  generalSettings,
  appearanceSettings,
  securitySettings,
  notificationSettings,
  businessSettings,
  backupSettings,
  passwordState,
  passwordVisibility,
  dialogState,
  settingsState,
};