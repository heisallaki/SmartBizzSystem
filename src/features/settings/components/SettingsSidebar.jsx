import PropTypes from "prop-types";

import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function SettingsSidebar({
  sections,
  activeSection,
  onSectionChange,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: (theme) =>
          `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        overflow: "hidden",
        position: {
          lg: "sticky",
        },
        top: 24,
      }}
    >
      <Stack
        spacing={0}
      >
        <Stack
          spacing={0.5}
          sx={{
            p: 2.5,
            borderBottom: (theme) =>
              `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Settings
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Configure SmartBizz to suit your business.
          </Typography>
        </Stack>

        <List disablePadding>
          {sections.map((section) => (
            <ListItemButton
              key={section.id}
              selected={
                activeSection === section.id
              }
              onClick={() =>
                onSectionChange(section.id)
              }
            >
              <ListItemText
                primary={section.label}
                secondary={
                  section.description
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Stack>
    </Paper>
  );
}

SettingsSidebar.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,

  activeSection: PropTypes.string.isRequired,

  onSectionChange: PropTypes.func.isRequired,
};