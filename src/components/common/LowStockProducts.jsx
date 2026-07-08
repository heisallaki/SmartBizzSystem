import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useNavigate } from "react-router-dom";

export default function LowStockProducts({ data }) {
  const navigate = useNavigate();

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Low Stock Products
          </Typography>

          <Button
            size="small"
            onClick={() => navigate("/inventory")}
          >
            View All
          </Button>
        </Box>

        <List disablePadding>
          {data.map((product) => {
            const progress = Math.min((product.stock / 20) * 100, 100);

            return (
              <ListItem
                key={product.id}
                disableGutters
                sx={{
                  display: "block",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={product.name}
                    secondary={`${product.stock} items remaining`}
                  />

                  <Chip
                    icon={<WarningAmberRoundedIcon />}
                    label="Low"
                    color="warning"
                    size="small"
                  />
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={progress}
                  color="warning"
                  sx={{
                    height: 8,
                    borderRadius: 5,
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}