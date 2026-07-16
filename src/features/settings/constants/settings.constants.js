export const SETTINGS_SECTIONS = [
  {
    id: "general",
    label: "General",
    description: "Business information & regional settings",
  },
  {
    id: "security",
    label: "User & Security",
    description: "Users, passwords & permissions",
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Theme & display preferences",
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Alerts & reminders",
  },
  {
    id: "business",
    label: "Business",
    description: "Invoices, tax & receipts",
  },
  {
    id: "backup",
    label: "Backup & Data",
    description: "Import, export & restore",
  },
  {
    id: "system",
    label: "System",
    description: "Application information",
  },
  {
    id: "support",
    label: "Support",
    description: "Help & documentation",
  },
];

export const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export const DENSITY_OPTIONS = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

export const CURRENCY_OPTIONS = [
  { value: "KES", label: "Kenyan Shilling (KES)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
];

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "sw", label: "Swahili" },
];

export const TIMEZONE_OPTIONS = [
  {
    value: "Africa/Nairobi",
    label: "Africa/Nairobi (GMT+3)",
  },
  {
    value: "UTC",
    label: "UTC",
  },
];

export const DATE_FORMAT_OPTIONS = [
  {
    value: "DD/MM/YYYY",
    label: "DD/MM/YYYY",
  },
  {
    value: "MM/DD/YYYY",
    label: "MM/DD/YYYY",
  },
  {
    value: "YYYY-MM-DD",
    label: "YYYY-MM-DD",
  },
];

export const NUMBER_FORMAT_OPTIONS = [
  {
    value: "1,234.56",
    label: "1,234.56",
  },
  {
    value: "1 234,56",
    label: "1 234,56",
  },
  {
    value: "1.234,56",
    label: "1.234,56",
  },
];

export const SESSION_TIMEOUT_OPTIONS = [
  {
    value: 15,
    label: "15 Minutes",
  },
  {
    value: 30,
    label: "30 Minutes",
  },
  {
    value: 60,
    label: "1 Hour",
  },
  {
    value: 120,
    label: "2 Hours",
  },
];

export const PAYMENT_METHOD_OPTIONS = [
  {
    value: "cash",
    label: "Cash",
  },
  {
    value: "mpesa",
    label: "M-Pesa",
  },
  {
    value: "card",
    label: "Card",
  },
  {
    value: "bank",
    label: "Bank Transfer",
  },
];

export const BACKUP_FREQUENCY_OPTIONS = [
  {
    value: "daily",
    label: "Daily",
  },
  {
    value: "weekly",
    label: "Weekly",
  },
  {
    value: "monthly",
    label: "Monthly",
  },
];

export const PRIMARY_COLOR_OPTIONS = [
  {
    label: "Teal",
    value: "teal",
  },
  {
    label: "Blue",
    value: "blue",
  },
  {
    label: "Purple",
    value: "purple",
  },
  {
    label: "Green",
    value: "green",
  },
  {
    label: "Orange",
    value: "orange",
  },
];