const { triggerRelay } = require('../services/guardianRelay');

const triggerEmergency = async (req, res) => {
  try {
    const { geolocation } = req.body;
    
    // Immediately trigger relay with emergency priority
    await triggerRelay({
      elderlyUserId: req.user.id,
      eventType: 'manual_emergency_trigger',
      priority: 'emergency',
      context: { geolocation, triggeredAt: new Date() }
    });

    res.status(200).json({ success: true, message: 'Emergency alert triggered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = { triggerEmergency };
