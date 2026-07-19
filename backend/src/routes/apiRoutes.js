const express = require('express');
const incidentService = require('../services/incidentService');
const screamDetectorService = require('../services/screamDetectorService');
const evidenceStorageService = require('../services/evidenceStorageService');
const geofenceService = require('../services/geofenceService');
const gpsService = require('../services/gpsService');
const ZohoCatalystService = require('../services/zohoCatalystService');
const cameraRecordingService = require('../services/cameraRecordingService');
const notificationService = require('../services/notificationService');
const { authMiddleware } = require('../auth/auth');

const router = express.Router();
const catalyst = new ZohoCatalystService();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'echoshield-backend' });
});

router.get('/dashboard', authMiddleware(['admin']), (req, res) => {
  res.json(incidentService.getDashboardSummary());
});

router.get('/incidents', authMiddleware(['admin', 'user']), (req, res) => {
  res.json(incidentService.getIncidents());
});

router.post('/incidents', authMiddleware(['admin', 'user']), async (req, res) => {
  const incident = incidentService.createIncident(req.body);
  const recording = cameraRecordingService.createRecordingSession(incident.id);
  const alert = notificationService.sendAlert({ event: 'incident_created', incidentId: incident.id });
  const syncResult = await catalyst.syncIncident(incident);
  res.status(201).json({ incident, recording, alert, syncResult });
});

router.post('/audio/analyze', authMiddleware(['admin', 'user']), async (req, res) => {
  const result = incidentService.generateIncidentFromAudio(req.body);
  const recording = cameraRecordingService.createRecordingSession(result.incident.id);
  const alert = notificationService.sendAlert({ event: 'audio_anomaly', incidentId: result.incident.id });
  const syncResult = await catalyst.syncIncident(result.incident);
  res.json({ ...result, recording, alert, syncResult });
});

router.post('/evidence', authMiddleware(['admin', 'user']), (req, res) => {
  const { filename, contentBase64 } = req.body;
  const stored = evidenceStorageService.storeEvidence(filename, contentBase64);
  res.json({ stored });
});

router.get('/evidence', authMiddleware(['admin', 'user']), (req, res) => {
  res.json(evidenceStorageService.listEvidence());
});

router.post('/notifications', authMiddleware(['admin']), async (req, res) => {
  const result = await catalyst.sendNotification(req.body);
  res.json(result);
});

router.post('/geofence/check', authMiddleware(['admin', 'user']), (req, res) => {
  const { lat, lng } = req.body;
  const center = { lat: 12.9716, lng: 77.5946 };
  const inside = geofenceService.isInsideGeofence(lat, lng, center, Number(process.env.DEFAULT_GEOFENCE_RADIUS || 500));
  res.json({ inside, center, radiusMeters: Number(process.env.DEFAULT_GEOFENCE_RADIUS || 500) });
});

router.get('/gps/location', authMiddleware(['admin', 'user']), (req, res) => {
  res.json(gpsService.getDeviceLocation());
});

router.get('/gps/route', authMiddleware(['admin', 'user']), (req, res) => {
  res.json(gpsService.getRouteSummary());
});

router.post('/scream-detect', authMiddleware(['admin', 'user']), (req, res) => {
  const result = screamDetectorService.createScreamAlert(req.body);
  res.json(result);
});

module.exports = router;
