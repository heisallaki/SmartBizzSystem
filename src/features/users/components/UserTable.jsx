import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

import DataTable from "../../../components/common/DataTable";
import userColumns from "../config/userColumns";

export default function UserTable({ rows, onEdit, onResetPassword, onDeactivate, currentUserId }) {
  return (
    <DataTable
      columns={userColumns(onEdit, onResetPassword, onDeactivate, currentUserId)}
      rows={rows}
      emptyIcon={GroupsOutlinedIcon}
      emptyTitle="No users found"
      emptyMessage="Try changing your search or filters."
    />
  );
}