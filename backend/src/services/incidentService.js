const { createScreamAlert } = require('./screamDetectorService');

let incidents = [
  {
    id: 'INC-1001',
    title: 'Suspicious crowd movement near station',
    description: 'Crowd converged rapidly near the main gate during a late-night patrol.',
    type: 'suspicious_activity',
    severity: 'medium',
    status: 'investigating',
    lat: 12.9716,
    lng: 77.5946,
    evidence: ['clip-1.mp4', 'photo-1.jpg'],
    createdAt: new Date().toISOString()
  }
];

function createIncident(payload) {
  const incident = {
    id: payload.id || `INC-${Date.now()}`,
    title: payload.title || 'New incident report',
    description: payload.description || 'Auto-generated incident',
    type: payload.type || 'suspicious_activity',
    severity: payload.severity || 'medium',
    status: payload.status || 'open',
    lat: payload.lat || 12.9716,
    lng: payload.lng || 77.5946,
    evidence: payload.evidence || [],
    createdAt: new Date().toISOString()
  };

  incidents.unshift(incident);
  return incident;
}

function getIncidents() {
  return incidents;
}

function getIncident(id) {
  return incidents.find((incident) => incident.id === id);
}

function updateIncident(id, updates) {
  incidents = incidents.map((incident) => (incident.id === id ? { ...incident, ...updates } : incident));
  return getIncident(id);
}

function generateIncidentFromAudio(payload) {
  const screamResult = createScreamAlert(payload);
  const incident = createIncident({
    title: screamResult.isScream ? 'Scream detected near patrol zone' : 'Audio anomaly detected',
    description: `Auto-generated from ${payload.source || 'microphone'} with confidence ${screamResult.result.confidence}%`,
    type: 'audio_event',
    severity: screamResult.severity,
    status: 'open',
    lat: payload.lat || 12.9716,
    lng: payload.lng || 77.5946,
    evidence: payload.evidence || []
  });

  return { incident, analysis: screamResult };
}

function getDashboardSummary() {
  const openCount = incidents.filter((item) => item.status === 'open').length;
  const investigatingCount = incidents.filter((item) => item.status === 'investigating').length;
  const highSeverity = incidents.filter((item) => item.severity === 'high').length;

  return {
    totalIncidents: incidents.length,
    openCount,
    investigatingCount,
    highSeverity,
    latest: incidents.slice(0, 3)
  };
}

module.exports = {
  createIncident,
  getIncidents,
  getIncident,
  updateIncident,
  generateIncidentFromAudio,
  getDashboardSummary
};
