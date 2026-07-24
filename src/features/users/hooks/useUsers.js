import { useEffect, useMemo, useState } from "react";

import userService from "../services/user.service";
import useAuth from "../../auth/hooks/useAuth";

export default function useUsers() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);

  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);

  // Set after creating a user (if no password was typed in) or resetting
  // one — surfaced once via TemporaryPasswordDialog, then discarded.
  const [tempPasswordInfo, setTempPasswordInfo] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [usersResult, rolesResult] = await Promise.allSettled([
        userService.getUsers(),
        userService.getRoles(),
      ]);

      if (usersResult.status === "fulfilled") {
        setUsers(usersResult.value);
      } else {
        showSnackbar(usersResult.reason.message, "error");
      }

      if (rolesResult.status === "fulfilled") {
        setRoles(rolesResult.value);
      } else {
        showSnackbar(rolesResult.reason.message, "error");
      }

      setLoading(false);
    };

    load();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, severity, message });
  };

  const closeSnackbar = () => {
    setSnackbar((previous) => ({ ...previous, open: false }));
  };

  const addUser = async (user) => {
    try {
      const { user: newUser, temporaryPassword } = await userService.createUser(user);

      setUsers((previousUsers) => [...previousUsers, newUser]);
      showSnackbar("User created successfully.");

      if (temporaryPassword) {
        setTempPasswordInfo({ email: newUser.email, password: temporaryPassword });
      }
    } catch (error) {
      showSnackbar(error.message, "error");
      throw error; // let the dialog know the save failed, so it stays open
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      const saved = await userService.updateUser(updatedUser);

      setUsers((previousUsers) =>
        previousUsers.map((user) => (user.id === saved.id ? saved : user))
      );
      showSnackbar("User updated successfully.");
    } catch (error) {
      showSnackbar(error.message, "error");
      throw error;
    }
  };

  const deactivateUser = async () => {
    if (!userToDeactivate) return;

    try {
      await userService.deactivateUser(userToDeactivate.id);

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== userToDeactivate.id)
      );
      showSnackbar("User deactivated.");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setDeactivateDialogOpen(false);
      setUserToDeactivate(null);
    }
  };

  const resetPassword = async () => {
    if (!userToResetPassword) return;

    try {
      const { temporaryPassword } = await userService.resetPassword(userToResetPassword.id);
      setTempPasswordInfo({ email: userToResetPassword.email, password: temporaryPassword });
      showSnackbar("Password reset.");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setResetPasswordDialogOpen(false);
      setUserToResetPassword(null);
    }
  };

  const clearTempPasswordInfo = () => setTempPasswordInfo(null);

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleEdit = (user) => {
    setDialogMode("edit");
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDeactivate = (user) => {
    setUserToDeactivate(user);
    setDeactivateDialogOpen(true);
  };

  const handleResetPassword = (user) => {
    setUserToResetPassword(user);
    setResetPasswordDialogOpen(true);
  };

  const roleNames = useMemo(() => ["All", ...roles.map((role) => role.name)], [roles]);

  const statuses = ["All", "Active", "Suspended", "Invited"];

  const sortOptions = ["Newest", "Oldest", "Name (A-Z)", "Name (Z-A)"];

  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    if (roleFilter !== "All") {
      filtered = filtered.filter((user) => user.role?.name === roleFilter);
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    switch (sortBy) {
      case "Newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "Oldest":
        filtered.sort((a, b) => a.id - b.id);
        break;
      case "Name (A-Z)":
        filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case "Name (Z-A)":
        filtered.sort((a, b) => b.fullName.localeCompare(a.fullName));
        break;
      default:
        break;
    }

    return filtered;
  }, [users, search, roleFilter, statusFilter, sortBy]);

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "Active").length;
  const adminCount = users.filter((user) => user.role?.name === "Admin").length;
  const suspendedUsers = users.filter((user) => user.status === "Suspended").length;

  return {
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
  };
}