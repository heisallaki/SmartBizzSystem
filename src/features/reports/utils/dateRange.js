const pad = (value) => String(value).padStart(2, "0");

const toDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

/**
 * Resolves a REPORT_DATE_FILTERS value (+ optional custom range) into
 * concrete { startDate, endDate } bounds, both "YYYY-MM-DD" strings.
 * All calendar math runs in local time via Date getters/constructors —
 * never via Date parsing/toISOString — so this is safe regardless of the
 * browser's timezone offset.
 */
export function resolveDateRange(dateFilter, customRange) {
  const now = new Date();
  const todayKey = toDateKey(now);

  switch (dateFilter) {
    case "today":
      return { startDate: todayKey, endDate: todayKey };

    case "yesterday": {
      const key = toDateKey(addDays(now, -1));
      return { startDate: key, endDate: key };
    }

    case "last7":
      return { startDate: toDateKey(addDays(now, -6)), endDate: todayKey };

    case "last30":
      return { startDate: toDateKey(addDays(now, -29)), endDate: todayKey };

    case "thisMonth":
      return {
        startDate: toDateKey(new Date(now.getFullYear(), now.getMonth(), 1)),
        endDate: todayKey,
      };

    case "lastMonth": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: toDateKey(start), endDate: toDateKey(end) };
    }

    case "thisYear":
      return {
        startDate: toDateKey(new Date(now.getFullYear(), 0, 1)),
        endDate: todayKey,
      };

    case "custom": {
      if (customRange?.startDate && customRange?.endDate) {
        const { startDate, endDate } = customRange;
        return startDate <= endDate
          ? { startDate, endDate }
          : { startDate: endDate, endDate: startDate };
      }

      return { startDate: toDateKey(addDays(now, -29)), endDate: todayKey };
    }

    default:
      return { startDate: toDateKey(addDays(now, -29)), endDate: todayKey };
  }
}

export function isWithinRange(dateKey, range) {
  return dateKey >= range.startDate && dateKey <= range.endDate;
}

function daysBetween(range) {
  const [sy, sm, sd] = range.startDate.split("-").map(Number);
  const [ey, em, ed] = range.endDate.split("-").map(Number);

  const start = Date.UTC(sy, sm - 1, sd);
  const end = Date.UTC(ey, em - 1, ed);

  return Math.round((end - start) / 86400000);
}

export function resolveGranularity(range) {
  return daysBetween(range) <= 31 ? "day" : "month";
}

export function bucketKeyFor(dateKey, granularity) {
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

/**
 * Builds the ordered sequence of buckets spanning a range (including
 * empty ones), so trend charts show continuous periods rather than
 * skipping gaps with no sales.
 */
export function buildBuckets(range, granularity) {
  const [sy, sm, sd] = range.startDate.split("-").map(Number);
  const [ey, em, ed] = range.endDate.split("-").map(Number);

  const buckets = [];

  if (granularity === "day") {
    const start = Date.UTC(sy, sm - 1, sd);
    const end = Date.UTC(ey, em - 1, ed);

    for (let cursor = start; cursor <= end; cursor += 86400000) {
      const current = new Date(cursor);

      const key = `${current.getUTCFullYear()}-${pad(
        current.getUTCMonth() + 1
      )}-${pad(current.getUTCDate())}`;

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
      label: sameYear
        ? MONTH_LABEL.format(labelDate)
        : MONTH_YEAR_LABEL.format(labelDate),
    });

    month += 1;

    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return buckets;
}