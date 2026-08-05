import { useCallback, useEffect, useState } from "react";

import backupsService from "../services/backups.service";

export default function useBackupHistory() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const data = await backupsService.getBackups();
      setBackups(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    backups,
    loading,
    refresh: load,
  };
}