const pad = (value) => String(value).padStart(2, "0");

function daysBetween(range) {
  const [sy, sm, sd] = range.startDate.split("-").map(Number);
  const [ey, em, ed] = range.endDate.split("-").map(Number);

  const start = Date.UTC(sy, sm - 1, sd);
  const end = Date.UTC(ey, em - 1, ed);

  return Math.round((end - start) / 86400000);
}

function resolveGranularity(range) {
  return daysBetween(range) <= 31 ? "day" : "month";
}

function bucketKeyFor(dateKey, granularity) {
  return granularity === "day" ? dateKey : dateKey.slice(0, 7);
}

const DAY_LABEL = new Intl.DateTimeFormat("en-KE", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const MONTH_LABEL = new Intl.DateTimeFormat("en-KE", {
  month: "short",
  timeZone: "UTC",
});

const MONTH_YEAR_LABEL = new Intl.DateTimeFormat("en-KE", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});

function buildBuckets(range, granularity) {
  const [sy, sm, sd] = range.startDate.split("-").map(Number);
  const [ey, em, ed] = range.endDate.split("-").map(Number);

  const buckets = [];

  if (granularity === "day") {
    const start = Date.UTC(sy, sm - 1, sd);
    const end = Date.UTC(ey, em - 1, ed);

    for (let cursor = start; cursor <= end; cursor += 86400000) {
      const current = new Date(cursor);
      const key = `${current.getUTCFullYear()}-${pad(current.getUTCMonth() + 1)}-${pad(current.getUTCDate())}`;
      buckets.push({ key, label: DAY_LABEL.format(current) });
    }

    return buckets;
  }

  const sameYear = sy === ey;
  let year = sy;
  let month = sm - 1;

  while (year < ey || (year === ey && month <= em - 1)) {
    const key = `${year}-${pad(month + 1)}`;
    const labelDate = new Date(Date.UTC(year, month, 1));

    buckets.push({
      key,
      label: sameYear ? MONTH_LABEL.format(labelDate) : MONTH_YEAR_LABEL.format(labelDate),
    });

    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return buckets;
}

module.exports = { resolveGranularity, bucketKeyFor, buildBuckets };