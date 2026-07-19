function isInsideGeofence(lat, lng, center, radiusMeters = 500) {
  const earthRadius = 6371000;
  const dLat = ((center.lat - lat) * Math.PI) / 180;
  const dLng = ((center.lng - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat * Math.PI) / 180) * Math.cos((center.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  return distance <= radiusMeters;
}

module.exports = {
  isInsideGeofence
};
