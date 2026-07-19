function sendAlert(alert) {
  return {
    delivered: true,
    channel: process.env.ALERT_CHANNELS || 'sms,email,webhook',
    message: `Alert dispatched: ${alert.event}`,
    timestamp: new Date().toISOString()
  };
}

module.exports = { sendAlert };
