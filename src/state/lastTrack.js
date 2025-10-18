const lastTrackMap = new Map();

export function setLastTrack(guildId, track) {
  lastTrackMap.set(guildId, track);
}

export function getLastTrack(guildId) {
  return lastTrackMap.get(guildId) || null;
}
