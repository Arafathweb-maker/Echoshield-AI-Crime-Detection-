function createRecordingSession(incidentId) {
  return {
    id: `REC-${Date.now()}`,
    incidentId,
    status: 'recording',
    startedAt: new Date().toISOString(),
    storage: 'cloud-evidence-store'
  };
}

module.exports = { createRecordingSession };
