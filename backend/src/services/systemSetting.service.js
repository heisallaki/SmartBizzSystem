const prisma = require("../config/prisma");

async function getSetting(key, defaultValue) {
  const row = await prisma.systemSetting.findUnique({ where: { settingKey: key } });
  return row ? row.settingValue : defaultValue;
}

async function setSetting(key, value, actorId) {
  return prisma.systemSetting.upsert({
    where: { settingKey: key },
    update: { settingValue: value, updatedBy: actorId },
    create: { settingKey: key, settingValue: value, updatedBy: actorId },
  });
}

module.exports = { getSetting, setSetting };