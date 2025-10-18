const autoplayMap = new Map();

export function isAutoplayEnabled(guildId) {
  return autoplayMap.get(guildId) === true;
}

export function setAutoplay(guildId, enabled) {
  autoplayMap.set(guildId, !!enabled);
  return autoplayMap.get(guildId);
}

export function toggleAutoplay(guildId) {
  const newVal = !isAutoplayEnabled(guildId);
  autoplayMap.set(guildId, newVal);
  return newVal;
}
