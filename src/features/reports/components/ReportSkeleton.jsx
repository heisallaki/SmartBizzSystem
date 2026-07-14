import {
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
} from "@mui/material";

function StatCardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Skeleton
            variant="text"
            width="45%"
            height={22}
          />

          <Skeleton
            variant="text"
            width="70%"
            height={40}
          />

          <Skeleton
            variant="circular"
            width={48}
            height={48}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Skeleton
            variant="text"
            width="35%"
            height={30}
          />

          <Skeleton
            variant="text"
            width="55%"
            height={20}
          />

          <Skeleton
            variant="rounded"
            width="100%"
            height={360}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Skeleton
            variant="text"
            width="30%"
            height={30}
          />

          <Skeleton
            variant="text"
            width="55%"
            height={20}
          />

          <Skeleton
            variant="rounded"
            width="100%"
            height={480}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

function ReportSkeleton() {
  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid
            key={index}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <StatCardSkeleton />
          </Grid>
        ))}
      </Grid>

      <ChartSkeleton />

      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            lg: 6,
          }}
        >
          <TableSkeleton />
        </Grid>

        <Grid
          size={{
            xs: 12,
            lg: 6,
          }}
        >
          <TableSkeleton />
        </Grid>
      </Grid>

      <TableSkeleton />
    </Stack>
  );
}

export default ReportSkeleton;