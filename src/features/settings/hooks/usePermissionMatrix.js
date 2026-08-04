import { useCallback, useEffect, useState } from "react";

import permissionsService from "../services/permissions.service";

export default function usePermissionMatrix() {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const [matrix, setMatrix] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingMatrix, setLoadingMatrix] = useState(false);
  const [saving, setSaving] = useState(false);

  const [snapshot, setSnapshot] = useState("[]");

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, severity, message });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((previous) => ({ ...previous, open: false }));
  }, []);

  useEffect(() => {
    let active = true;

    const loadRoles = async () => {
      try {
        const data = await permissionsService.getRoles();
        if (!active) return;

        setRoles(data);
        if (data.length > 0) setSelectedRoleId(data[0].id);
      } catch (error) {
        if (active) showSnackbar(error.message, "error");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadRoles();

    return () => {
      active = false;
    };
  }, [showSnackbar]);

  useEffect(() => {
    if (selectedRoleId === null) return undefined;

    let active = true;

    const loadMatrix = async () => {
      setLoadingMatrix(true);

      try {
        const data = await permissionsService.getRoleMatrix(selectedRoleId);
        if (!active) return;

        setMatrix(data);
        setSnapshot(JSON.stringify(data));
      } catch (error) {
        if (active) showSnackbar(error.message, "error");
      } finally {
        if (active) setLoadingMatrix(false);
      }
    };

    loadMatrix();

    return () => {
      active = false;
    };
  }, [selectedRoleId, showSnackbar]);

  const handlePermissionChange = useCallback((module, permission, checked) => {
    setMatrix((previous) =>
      previous.map((row) => (row.module === module ? { ...row, [permission]: checked } : row))
    );
  }, []);

  const dirty = JSON.stringify(matrix) !== snapshot;

  const save = useCallback(async () => {
    if (selectedRoleId === null) return;

    setSaving(true);

    try {
      const saved = await permissionsService.updateRoleMatrix(selectedRoleId, matrix);

      setMatrix(saved);
      setSnapshot(JSON.stringify(saved));

      showSnackbar("Permissions saved successfully.");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setSaving(false);
    }
  }, [selectedRoleId, matrix, showSnackbar]);

  const discard = useCallback(() => {
    setMatrix(JSON.parse(snapshot));
  }, [snapshot]);

  return {
    roles,
    selectedRoleId,
    setSelectedRoleId,

    matrix,

    loading,
    loadingMatrix,
    saving,
    dirty,

    handlePermissionChange,
    save,
    discard,

    snackbar,
    closeSnackbar,
  };
}