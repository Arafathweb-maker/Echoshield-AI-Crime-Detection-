function getDeviceLocation() {
  return {
    lat: 12.9716,
    lng: 77.5946,
    accuracy: 8,
    timestamp: new Date().toISOString()
  };
}

function getRouteSummary() {
  return {
    speedKph: 36,
    heading: 175,
    status: 'active',
    lastUpdated: new Date().toISOString()
  };
}

module.exports = {
  getDeviceLocation,
  getRouteSummary
};
