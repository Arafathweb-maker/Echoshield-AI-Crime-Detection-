function classifyAudioSignal(energy, threshold = 70) {
  const normalizedEnergy = Number(energy || 0);
  const confidence = Math.min(100, Math.round((normalizedEnergy / threshold) * 100));
  const isScream = normalizedEnergy > threshold;

  return {
    isScream,
    confidence: Math.max(0, confidence),
    threshold,
    reason: isScream ? 'High energy spike detected' : 'Ambient noise only'
  };
}

function createScreamAlert(payload) {
  const result = classifyAudioSignal(payload.energy, payload.threshold);
  return {
    event: result.isScream ? 'scream_detected' : 'noise_monitor',
    severity: result.isScream ? 'high' : 'low',
    result
  };
}

module.exports = {
  classifyAudioSignal,
  createScreamAlert
};
