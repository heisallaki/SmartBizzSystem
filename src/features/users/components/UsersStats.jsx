import Grid from "@mui/material/Grid";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";

import StatCard from "../../../components/common/StatCard";

export default function UsersStats({ totalUsers, activeUsers, adminCount, suspendedUsers }) {
  return (
    <Grid container spacing={3} mb={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Total Users" value={totalUsers} icon={<GroupsOutlinedIcon />} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Active" value={activeUsers} icon={<TaskAltOutlinedIcon />} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Admins"
          value={adminCount}
          icon={<AdminPanelSettingsOutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Suspended" value={suspendedUsers} icon={<PersonOffOutlinedIcon />} />
      </Grid>
    </Grid>
  );
}