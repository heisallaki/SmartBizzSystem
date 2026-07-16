import { useState } from "react";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArticleRounded,
  BackupRounded,
  CheckCircleRounded,
  DeleteForeverRounded,
  FileDownloadRounded,
  FileUploadRounded,
  GavelRounded,
  LockRounded,
  OpenInNewRounded,
  PrivacyTipRounded,
  RestoreRounded,
  SupportAgentRounded,
  WarningAmberRounded,
} from "@mui/icons-material";

import { saveAs } from "file-saver";

import PageHeader from "../../components/common/PageHeader";
import SnackbarAlert from "../../components/feedback/SnackbarAlert";

import useSettings from "./hooks/useSettings";

import SettingsSidebar from "./components/SettingsSidebar";
import SettingsSection from "./components/SettingsSection";
import SettingsCard from "./components/SettingsCard";
import SettingsSwitch from "./components/SettingsSwitch";
import SettingsSelect from "./components/SettingsSelect";
import SettingsTextField from "./components/SettingsTextField";
import SaveSettingsBar from "./components/SaveSettingsBar";
import PasswordDialog from "./components/PasswordDialog";
import ConfirmationDialog from "./components/ConfirmationDialog";
import ImportDialog from "./components/ImportDialog";
import ExportDialog from "./components/ExportDialog";
import LogoUploader from "./components/LogoUploader";
import ColorPicker from "./components/ColorPicker";
import ThemeSelector from "./components/ThemeSelector";
import PermissionTable from "./components/PermissionTable";

import {
  SETTINGS_SECTIONS,
  THEME_OPTIONS,
  DENSITY_OPTIONS,
  CURRENCY_OPTIONS,
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  DATE_FORMAT_OPTIONS,
  NUMBER_FORMAT_OPTIONS,
  SESSION_TIMEOUT_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  BACKUP_FREQUENCY_OPTIONS,
  PRIMARY_COLOR_OPTIONS,
} from "./constants/settings.constants";

import * as settingsActions from "./services/settings.actions";

const APP_VERSION = "1.0.0";
const APP_BUILD = "2026.07.16";

const TECH_STACK = [
  "React 19",
  "Vite 8",
  "Material UI 7",
  "MUI X DataGrid 9",
  "React Router 7",
  "Recharts",
];

const SUPPORT_LINKS = [
  {
    id: "documentation",
    label: "Documentation",
    description: "Guides and tutorials for using SmartBizz.",
    icon: ArticleRounded,
    href: "https://docs.smartbizz.app",
  },
  {
    id: "contact",
    label: "Contact Support",
    description: "Reach out to the SmartBizz support team.",
    icon: SupportAgentRounded,
    href: "mailto:support@smartbizz.com",
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    description: "Learn how your data is collected and used.",
    icon: PrivacyTipRounded,
    href: "https://smartbizz.app/privacy",
  },
  {
    id: "terms",
    label: "Terms of Service",
    description: "Review the terms that govern SmartBizz usage.",
    icon: GavelRounded,
    href: "https://smartbizz.app/terms",
  },
];

export default function SettingsPage() {
  const {
    settings,

    general,
    appearance,
    security,
    notifications,
    business,
    backup,

    loading,
    saving,
    dirty,

    dialogs,
    openDialog,
    closeDialog,

    snackbar,
    showSnackbar,
    closeSnackbar,

    activeSection,
    setActiveSection,

    selectedFile,
    selectImportFile,
    clearImportFile,

    saveSettings,
  } = useSettings();

  const [processing, setProcessing] = useState(false);
  const [lastBackupSnapshot, setLastBackupSnapshot] =
    useState(null);

  const handleResetAll = () => {
    general.reset();
    appearance.reset();
    security.reset();
    notifications.reset();
    business.reset();
    backup.reset();
  };

  const handleChangePassword = () => {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = security.passwords;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      showSnackbar(
        "Please fill in all password fields.",
        "error"
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      showSnackbar(
        "New password and confirmation do not match.",
        "error"
      );

      return;
    }

    if (newPassword.length < 6) {
      showSnackbar(
        "New password must be at least 6 characters.",
        "error"
      );

      return;
    }

    security.clearPasswords();
    closeDialog("password");

    showSnackbar("Password updated successfully.");
  };

  const handleExport = async () => {
    try {
      setProcessing(true);

      const data = await settingsActions.exportSettings(
        settings
      );

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
      );

      saveAs(
        blob,
        `smartbizz-settings-${Date.now()}.json`
      );

      closeDialog("export");

      showSnackbar("Settings exported successfully.");
    } catch {
      showSnackbar(
        "Failed to export settings.",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      setProcessing(true);

      const data = await settingsActions.importSettings(
        selectedFile
      );

      if (data.general) general.update(data.general);
      if (data.appearance)
        appearance.update(data.appearance);
      if (data.security)
        security.update(data.security);
      if (data.notifications)
        notifications.update(data.notifications);
      if (data.business)
        business.update(data.business);
      if (data.backup) backup.update(data.backup);

      clearImportFile();
      closeDialog("import");

      showSnackbar("Settings imported successfully.");
    } catch {
      showSnackbar(
        "Failed to import settings. Please check the file and try again.",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setProcessing(true);

      const result = await settingsActions.createBackup(
        settings
      );

      setLastBackupSnapshot(result);

      backup.update({
        lastBackup: result.createdAt,
      });

      closeDialog("backup");

      showSnackbar("Backup created successfully.");
    } catch {
      showSnackbar(
        "Failed to create backup.",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!lastBackupSnapshot) return;

    try {
      setProcessing(true);

      const data = await settingsActions.restoreBackup(
        lastBackupSnapshot
      );

      general.update(data.general);
      appearance.update(data.appearance);
      security.update(data.security);
      notifications.update(data.notifications);
      business.update(data.business);
      backup.update(data.backup);

      closeDialog("restore");

      showSnackbar("Settings restored from backup.");
    } catch {
      showSnackbar(
        "Failed to restore backup.",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleResetDemoData = async () => {
    try {
      setProcessing(true);

      await settingsActions.resetDemoData();

      handleResetAll();
      setLastBackupSnapshot(null);

      closeDialog("reset");

      showSnackbar("Demo data has been reset.");
    } catch {
      showSnackbar(
        "Failed to reset demo data.",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Settings"
        subtitle="Configure SmartBizz to match how your business runs."
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <SettingsSidebar
            sections={SETTINGS_SECTIONS}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 9 }}>
          {activeSection === "general" && (
            <SettingsSection
              title="General Settings"
              description="Configure your business identity and regional preferences."
            >
              <Grid size={{ xs: 12, md: 7 }}>
                <SettingsCard
                  title="Business Information"
                  description="Basic details about your business."
                >
                  <SettingsTextField
                    label="Business Name"
                    name="businessName"
                    value={general.settings.businessName}
                    onChange={general.handleInputChange}
                  />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SettingsTextField
                        label="Business Email"
                        name="businessEmail"
                        type="email"
                        value={
                          general.settings.businessEmail
                        }
                        onChange={
                          general.handleInputChange
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SettingsTextField
                        label="Business Phone"
                        name="businessPhone"
                        value={
                          general.settings.businessPhone
                        }
                        onChange={
                          general.handleInputChange
                        }
                      />
                    </Grid>
                  </Grid>

                  <SettingsTextField
                    label="Business Address"
                    name="businessAddress"
                    value={
                      general.settings.businessAddress
                    }
                    onChange={general.handleInputChange}
                    multiline
                    rows={2}
                  />
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <LogoUploader
                  logo={general.settings.businessLogo}
                  businessName={
                    general.settings.businessName
                  }
                  onUpload={general.handleLogoChange}
                  onRemove={general.removeLogo}
                  disabled={saving}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <SettingsCard
                  title="Regional & Formatting"
                  description="Currency, language and formatting preferences used across the system."
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SettingsSelect
                        label="Currency"
                        name="currency"
                        value={general.settings.currency}
                        options={CURRENCY_OPTIONS}
                        onChange={
                          general.handleInputChange
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SettingsSelect
                        label="Language"
                        name="language"
                        value={general.settings.language}
                        options={LANGUAGE_OPTIONS}
                        onChange={
                          general.handleInputChange
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SettingsSelect
                        label="Time Zone"
                        name="timezone"
                        value={general.settings.timezone}
                        options={TIMEZONE_OPTIONS}
                        onChange={
                          general.handleInputChange
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SettingsSelect
                        label="Date Format"
                        name="dateFormat"
                        value={
                          general.settings.dateFormat
                        }
                        options={DATE_FORMAT_OPTIONS}
                        onChange={
                          general.handleInputChange
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SettingsSelect
                        label="Number Format"
                        name="numberFormat"
                        value={
                          general.settings.numberFormat
                        }
                        options={NUMBER_FORMAT_OPTIONS}
                        onChange={
                          general.handleInputChange
                        }
                      />
                    </Grid>
                  </Grid>
                </SettingsCard>
              </Grid>
            </SettingsSection>
          )}

          {activeSection === "security" && (
            <SettingsSection
              title="User & Security"
              description="Manage your profile, password, permissions and session behavior."
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Profile"
                  description="Update your personal information."
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SettingsTextField
                        label="First Name"
                        name="firstName"
                        value={
                          security.settings.profile
                            .firstName
                        }
                        onChange={
                          security.handleProfileChange
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SettingsTextField
                        label="Last Name"
                        name="lastName"
                        value={
                          security.settings.profile
                            .lastName
                        }
                        onChange={
                          security.handleProfileChange
                        }
                      />
                    </Grid>
                  </Grid>

                  <SettingsTextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={
                      security.settings.profile.email
                    }
                    onChange={
                      security.handleProfileChange
                    }
                  />
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Password"
                  description="Change your account password regularly to keep your account secure."
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <LockRounded color="action" />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Use a strong password that you
                      don&apos;t reuse on other accounts.
                    </Typography>
                  </Stack>

                  <Button
                    variant="outlined"
                    onClick={() =>
                      openDialog("password")
                    }
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Change Password
                  </Button>
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <SettingsCard
                  title="Roles & Permissions"
                  description="Configure what each module allows for this account."
                >
                  <PermissionTable
                    permissions={security.settings.roles}
                    onPermissionChange={
                      security.handlePermissionChange
                    }
                  />
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <SettingsCard
                  title="Session Preferences"
                  description="Control session timeout and sign-in behavior."
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SettingsSelect
                        label="Session Timeout"
                        name="sessionTimeout"
                        value={
                          security.settings.sessionTimeout
                        }
                        options={
                          SESSION_TIMEOUT_OPTIONS
                        }
                        onChange={
                          security.handleInputChange
                        }
                      />
                    </Grid>
                  </Grid>

                  <SettingsSwitch
                    title="Two-Factor Authentication"
                    description="Require a verification code in addition to your password when signing in."
                    name="twoFactorAuthentication"
                    checked={
                      security.settings
                        .twoFactorAuthentication
                    }
                    onChange={
                      security.handleSwitchChange
                    }
                  />

                  <SettingsSwitch
                    title="Remember Last Workspace"
                    description="Reopen the last screen you were working on when you sign back in."
                    name="rememberLastWorkspace"
                    checked={
                      security.settings
                        .rememberLastWorkspace
                    }
                    onChange={
                      security.handleSwitchChange
                    }
                  />
                </SettingsCard>
              </Grid>
            </SettingsSection>
          )}

          {activeSection === "appearance" && (
            <SettingsSection
              title="Appearance"
              description="Personalize how SmartBizz looks and feels."
            >
              <Grid size={{ xs: 12 }}>
                <SettingsCard
                  title="Theme"
                  description="Choose how SmartBizz looks on your device."
                >
                  <ThemeSelector
                    value={appearance.settings.theme}
                    options={THEME_OPTIONS}
                    onChange={appearance.setTheme}
                  />
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard>
                  <ColorPicker
                    colors={PRIMARY_COLOR_OPTIONS}
                    value={
                      appearance.settings.primaryColor
                    }
                    onChange={
                      appearance.setPrimaryColor
                    }
                    title="Primary Color"
                    description="This color is used for buttons, links and highlights across the app."
                  />
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Layout"
                  description="Adjust density and sidebar behavior."
                >
                  <SettingsSelect
                    label="Density"
                    name="density"
                    value={appearance.settings.density}
                    options={DENSITY_OPTIONS}
                    onChange={
                      appearance.handleInputChange
                    }
                  />
                </SettingsCard>
              </Grid>
            </SettingsSection>
          )}

          {activeSection === "notifications" && (
            <SettingsSection
              title="Notifications"
              description="Choose which alerts and reminders you want to receive."
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Notification Channels"
                  description="Choose how you want to receive updates."
                >
                  <SettingsSwitch
                    title="Email Notifications"
                    description="Receive important updates by email."
                    name="emailNotifications"
                    checked={
                      notifications.settings
                        .emailNotifications
                    }
                    onChange={
                      notifications.handleSwitchChange
                    }
                  />

                  <SettingsSwitch
                    title="System Notifications"
                    description="Show in-app notifications while you work."
                    name="systemNotifications"
                    checked={
                      notifications.settings
                        .systemNotifications
                    }
                    onChange={
                      notifications.handleSwitchChange
                    }
                  />
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Alerts & Reminders"
                  description="Stay informed about important business events."
                >
                  <SettingsSwitch
                    title="Sales Alerts"
                    description="Get notified whenever a new sale is recorded."
                    name="salesAlerts"
                    checked={
                      notifications.settings.salesAlerts
                    }
                    onChange={
                      notifications.handleSwitchChange
                    }
                  />

                  <SettingsSwitch
                    title="Low Stock Alerts"
                    description="Get notified when products fall below their reorder level."
                    name="lowStockAlerts"
                    checked={
                      notifications.settings
                        .lowStockAlerts
                    }
                    onChange={
                      notifications.handleSwitchChange
                    }
                  />

                  <SettingsSwitch
                    title="Backup Reminders"
                    description="Get reminded to back up your data on schedule."
                    name="backupReminders"
                    checked={
                      notifications.settings
                        .backupReminders
                    }
                    onChange={
                      notifications.handleSwitchChange
                    }
                  />
                </SettingsCard>
              </Grid>
            </SettingsSection>
          )}

          {activeSection === "business" && (
            <SettingsSection
              title="Business"
              description="Configure tax, invoicing and default sales behavior."
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Tax / VAT"
                  description="Configure how tax is applied to sales."
                >
                  <SettingsSwitch
                    title="Enable Tax / VAT"
                    description="Apply tax to sales and invoices."
                    name="taxEnabled"
                    checked={business.settings.taxEnabled}
                    onChange={business.handleSwitchChange}
                  />

                  <SettingsTextField
                    label="Tax Rate (%)"
                    name="taxRate"
                    type="number"
                    value={business.settings.taxRate}
                    onChange={business.handleInputChange}
                    disabled={
                      !business.settings.taxEnabled
                    }
                    helperText="Percentage applied to taxable sales."
                  />
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Invoice Numbering"
                  description="Control how invoice numbers are generated."
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SettingsTextField
                        label="Invoice Prefix"
                        name="invoicePrefix"
                        value={
                          business.settings.invoicePrefix
                        }
                        onChange={
                          business.handleInputChange
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SettingsTextField
                        label="Next Invoice Number"
                        name="nextInvoiceNumber"
                        type="number"
                        value={
                          business.settings
                            .nextInvoiceNumber
                        }
                        onChange={
                          business.handleInputChange
                        }
                      />
                    </Grid>
                  </Grid>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {`Next invoice will be numbered ${business.settings.invoicePrefix}-${business.settings.nextInvoiceNumber}.`}
                  </Typography>
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Receipt Settings"
                  description="Customize the message printed on receipts."
                >
                  <SettingsTextField
                    label="Receipt Footer Message"
                    name="receiptFooter"
                    value={
                      business.settings.receiptFooter
                    }
                    onChange={business.handleInputChange}
                    multiline
                    rows={3}
                  />
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Defaults"
                  description="Default values used when creating new sales."
                >
                  <SettingsSelect
                    label="Default Payment Method"
                    name="defaultPaymentMethod"
                    value={
                      business.settings
                        .defaultPaymentMethod
                    }
                    options={PAYMENT_METHOD_OPTIONS}
                    onChange={business.handleInputChange}
                  />

                  <SettingsTextField
                    label="Default Customer"
                    name="defaultCustomer"
                    value={
                      business.settings.defaultCustomer
                    }
                    onChange={business.handleInputChange}
                  />
                </SettingsCard>
              </Grid>
            </SettingsSection>
          )}

          {activeSection === "backup" && (
            <SettingsSection
              title="Backup & Data"
              description="Protect your data with backups, and manage import, export and demo data."
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Automatic Backup"
                  description="Automatically back up your data on a schedule."
                >
                  <SettingsSwitch
                    title="Enable Automatic Backup"
                    description="Create backups automatically at the selected frequency."
                    name="autoBackup"
                    checked={backup.settings.autoBackup}
                    onChange={backup.handleSwitchChange}
                  />

                  <SettingsSelect
                    label="Backup Frequency"
                    name="backupFrequency"
                    value={
                      backup.settings.backupFrequency
                    }
                    options={BACKUP_FREQUENCY_OPTIONS}
                    onChange={backup.handleInputChange}
                    disabled={
                      !backup.settings.autoBackup
                    }
                  />

                  <Stack spacing={1.5}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {backup.settings.lastBackup
                        ? `Last backup: ${new Date(
                            backup.settings.lastBackup
                          ).toLocaleString()}`
                        : "No backups have been created yet."}
                    </Typography>

                    <Button
                      variant="contained"
                      startIcon={<BackupRounded />}
                      onClick={() =>
                        openDialog("backup")
                      }
                      sx={{ alignSelf: "flex-start" }}
                    >
                      Backup Now
                    </Button>
                  </Stack>
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Restore"
                  description="Restore your data from the most recent backup taken this session."
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {lastBackupSnapshot
                      ? "A backup is available to restore."
                      : "Create a backup first to enable restore."}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<RestoreRounded />}
                    disabled={!lastBackupSnapshot}
                    onClick={() =>
                      openDialog("restore")
                    }
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Restore Latest Backup
                  </Button>
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Export & Import"
                  description="Move your settings between installations."
                >
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={2}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<FileDownloadRounded />}
                      onClick={() =>
                        openDialog("export")
                      }
                    >
                      Export Settings
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<FileUploadRounded />}
                      onClick={() =>
                        openDialog("import")
                      }
                    >
                      Import Settings
                    </Button>
                  </Stack>
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Reset Demo Data"
                  description="Restore all data to its original demo state. This cannot be undone."
                >
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteForeverRounded />}
                    onClick={() => openDialog("reset")}
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Reset Demo Data
                  </Button>
                </SettingsCard>
              </Grid>
            </SettingsSection>
          )}

          {activeSection === "system" && (
            <SettingsSection
              title="System"
              description="Information about this SmartBizz installation."
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="Version"
                  description="Current application version and release details."
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Chip
                      label={`v${APP_VERSION}`}
                      color="primary"
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {`Build ${APP_BUILD}`}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CheckCircleRounded
                      color="success"
                      fontSize="small"
                    />

                    <Typography variant="body2">
                      You are using the latest version.
                    </Typography>
                  </Stack>
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SettingsCard
                  title="License"
                  description="Licensing information for this installation."
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Licensed to
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {general.settings.businessName}
                    </Typography>
                  </Stack>

                  <Chip
                    label="Standard License · Active"
                    color="success"
                    variant="outlined"
                    sx={{ alignSelf: "flex-start" }}
                  />
                </SettingsCard>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <SettingsCard
                  title="About SmartBizz"
                  description="A professional business management system built for growing businesses."
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    SmartBizz helps you manage inventory,
                    sales, customers, suppliers and
                    reporting from a single, unified
                    workspace.
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                  >
                    {TECH_STACK.map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </SettingsCard>
              </Grid>
            </SettingsSection>
          )}

          {activeSection === "support" && (
            <SettingsSection
              title="Support"
              description="Get help and learn more about SmartBizz."
            >
              <Grid size={{ xs: 12 }}>
                <SettingsCard
                  title="Help & Resources"
                  description="Documentation, support and legal information."
                >
                  <List disablePadding>
                    {SUPPORT_LINKS.map(
                      (link, index) => {
                        const Icon = link.icon;

                        return (
                          <Stack
                            key={link.id}
                            spacing={0}
                          >
                            <ListItemButton
                              component="a"
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                borderRadius: 2,
                                px: 1.5,
                                py: 1.5,
                              }}
                            >
                              <ListItemIcon>
                                <Icon color="action" />
                              </ListItemIcon>

                              <ListItemText
                                primary={link.label}
                                secondary={
                                  link.description
                                }
                              />

                              <OpenInNewRounded
                                fontSize="small"
                                color="disabled"
                              />
                            </ListItemButton>

                            {index <
                              SUPPORT_LINKS.length -
                                1 && (
                              <Divider
                                sx={{ my: 0.5 }}
                              />
                            )}
                          </Stack>
                        );
                      }
                    )}
                  </List>
                </SettingsCard>
              </Grid>
            </SettingsSection>
          )}
        </Grid>
      </Grid>

      <SaveSettingsBar
        visible={dirty}
        saving={saving}
        onSave={saveSettings}
        onReset={handleResetAll}
      />

      <PasswordDialog
        open={dialogs.password}
        passwords={security.passwords}
        showPasswords={security.showPasswords}
        onClose={() => {
          closeDialog("password");
          security.clearPasswords();
        }}
        onSave={handleChangePassword}
        onPasswordChange={security.handlePasswordChange}
        onToggleVisibility={
          security.togglePasswordVisibility
        }
      />

      <ExportDialog
        open={dialogs.export}
        loading={processing}
        onClose={() => closeDialog("export")}
        onExport={handleExport}
      />

      <ImportDialog
        open={dialogs.import}
        loading={processing}
        selectedFile={selectedFile}
        onClose={() => {
          closeDialog("import");
          clearImportFile();
        }}
        onImport={handleImport}
        onFileSelect={selectImportFile}
      />

      <ConfirmationDialog
        open={dialogs.backup}
        loading={processing}
        title="Create Backup"
        message="This will create a snapshot of your current settings that can be restored later."
        icon={
          <BackupRounded
            color="primary"
            sx={{ fontSize: 48 }}
          />
        }
        confirmText="Backup Now"
        confirmColor="primary"
        onClose={() => closeDialog("backup")}
        onConfirm={handleCreateBackup}
      />

      <ConfirmationDialog
        open={dialogs.restore}
        loading={processing}
        title="Restore Backup"
        message="This will overwrite your current settings with the most recent backup. This action cannot be undone."
        icon={
          <RestoreRounded
            color="warning"
            sx={{ fontSize: 48 }}
          />
        }
        confirmText="Restore"
        confirmColor="warning"
        onClose={() => closeDialog("restore")}
        onConfirm={handleRestoreBackup}
      />

      <ConfirmationDialog
        open={dialogs.reset}
        loading={processing}
        title="Reset Demo Data"
        message="This will erase all changes and restore SmartBizz to its original demo state. This action cannot be undone."
        icon={
          <WarningAmberRounded
            color="error"
            sx={{ fontSize: 48 }}
          />
        }
        confirmText="Reset Data"
        confirmColor="error"
        onClose={() => closeDialog("reset")}
        onConfirm={handleResetDemoData}
      />

      <SnackbarAlert
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={closeSnackbar}
      />
    </Box>
  );
}