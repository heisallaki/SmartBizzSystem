const BUSINESS_UTC_OFFSET_HOURS = 3;

function getBusinessNow() {
  return new Date(Date.now() + BUSINESS_UTC_OFFSET_HOURS * 60 * 60 * 1000);
}

function getBusinessDateOnly(date = getBusinessNow()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function getBusinessToday() {
  return getBusinessDateOnly(getBusinessNow());
}

module.exports = { getBusinessNow, getBusinessDateOnly, getBusinessToday };