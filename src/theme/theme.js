import { createTheme } from "@mui/material/styles";

import { colors } from "./colors";
import typography from "./typography";
import spacing from "./spacing";
import components from "./components";

const theme = createTheme({
  palette: colors,
  typography,
  spacing,
  components,

  shape: {
    borderRadius: 12,
  },
});

export default theme;