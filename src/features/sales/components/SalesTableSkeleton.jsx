import {
  Skeleton,
  Stack,
  Paper,
} from "@mui/material";

export default function SalesTableSkeleton() {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
      }}
    >
      <Stack spacing={2}>
        <Skeleton
          variant="rounded"
          height={52}
        />

        {Array.from({ length: 10 }).map(
          (_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              height={56}
            />
          )
        )}
      </Stack>
    </Paper>
  );
}