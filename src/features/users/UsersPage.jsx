import Box from "@mui/material/Box";

import PageHeader from "../../components/common/PageHeader";

import UsersToolbar from "./components/UsersToolbar";
import UsersStats from "./components/UsersStats";
import UserTable from "./components/UserTable";
import UserTableSkeleton from "./components/UserTableSkeleton";
import UserDialog from "./components/UserDialog";
import DeactivateUserDialog from "./components/DeactivateUserDialog";
import ResetPasswordDialog from "./components/ResetPasswordDialog";
import TemporaryPasswordDialog from "./components/TemporaryPasswordDialog";

import SnackbarAlert from "../../components/feedback/SnackbarAlert";

import useUsers from "./hooks/useUsers";

export default function UsersPage() {
  const {
    loading,
    currentUser,

    roles,
    filteredUsers,

    search,
    setSearch,

    roleFilter,
    setRoleFilter,
    roleNames,

    statusFilter,
    setStatusFilter,
    statuses,

    sortBy,
    setSortBy,
    sortOptions,

    totalUsers,
    activeUsers,
    adminCount,
    suspendedUsers,

    openDialog,
    setOpenDialog,
    dialogMode,
    selectedUser,

    addUser,
    updateUser,

    deactivateDialogOpen,
    setDeactivateDialogOpen,
    userToDeactivate,
    deactivateUser,

    resetPasswordDialogOpen,
    setResetPasswordDialogOpen,
    userToResetPassword,
    resetPassword,

    tempPasswordInfo,
    clearTempPasswordInfo,

    handleAdd,
    handleEdit,
    handleDeactivate,
    handleResetPassword,

    snackbar,
    closeSnackbar,
  } = useUsers();

  // UserDialog awaits this and only closes itself on success — a thrown
  // error (already surfaced via snackbar inside addUser/updateUser) leaves
  // the dialog open so the admin can correct it, rather than closing over
  // a real server rejection like "last active Admin" or a duplicate email.
  const handleSaveUser = (user) => (dialogMode === "edit" ? updateUser(user) : addUser(user));

  const isSelf = dialogMode === "edit" && selectedUser?.id === currentUser?.id;

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle="Manage staff accounts, roles, and access."
      />

      <UsersStats
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        adminCount={adminCount}
        suspendedUsers={suspendedUsers}
      />

      <UsersToolbar
        search={search}
        onSearch={setSearch}
        role={roleFilter}
        roles={roleNames}
        onRoleChange={setRoleFilter}
        status={statusFilter}
        statuses={statuses}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
        onAdd={handleAdd}
      />

      {loading ? (
        <UserTableSkeleton />
      ) : (
        <UserTable
          rows={filteredUsers}
          onEdit={handleEdit}
          onResetPassword={handleResetPassword}
          onDeactivate={handleDeactivate}
          currentUserId={currentUser?.id}
        />
      )}

      <UserDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveUser}
        selectedUser={selectedUser}
        mode={dialogMode}
        roles={roles}
        isSelf={isSelf}
      />

      <DeactivateUserDialog
        open={deactivateDialogOpen}
        user={userToDeactivate}
        onClose={() => setDeactivateDialogOpen(false)}
        onDeactivate={deactivateUser}
      />

      <ResetPasswordDialog
        open={resetPasswordDialogOpen}
        user={userToResetPassword}
        onClose={() => setResetPasswordDialogOpen(false)}
        onReset={resetPassword}
      />

      <TemporaryPasswordDialog
        open={!!tempPasswordInfo}
        info={tempPasswordInfo}
        onClose={clearTempPasswordInfo}
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