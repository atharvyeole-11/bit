const Guardian = require('../models/Guardian');
const RelayLog = require('../models/RelayLog');
const { sendNotification } = require('./notificationEngine');

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const triggerRelay = async ({ elderlyUserId, eventType, priority = 'normal', context = {} }) => {
  console.log(`[GuardianRelay] Triggered for user ${elderlyUserId}, Event: ${eventType}, Priority: ${priority}`);
  
  const log = new RelayLog({
    elderlyUserId,
    eventType,
    priority,
    context
  });
  await log.save();

  // Fetch guardians sorted by priority (1 is highest)
  const guardians = await Guardian.find({ elderlyUserId }).sort({ contactPriority: 1 });

  if (!guardians || guardians.length === 0) {
    console.log(`[GuardianRelay] No guardians found for user ${elderlyUserId}. Escalating to emergency services/admin.`);
    log.status = 'failed';
    await log.save();
    return;
  }

  if (priority === 'emergency') {
    // Bypass timeouts, blast all channels to all guardians
    log.status = 'escalated';
    await log.save();
    
    for (const guardian of guardians) {
      await sendNotification({
        userId: guardian.userId,
        channels: ['sms', 'email', 'push', 'in-app'],
        message: `EMERGENCY ALERT for ${elderlyUserId}: ${eventType}`,
        priority: 'emergency'
      });
    }
    return;
  }

  // Sequential escalation for non-emergencies
  for (let i = 0; i < guardians.length; i++) {
    const guardian = guardians[i];
    log.escalationLevel = i + 1;
    await log.save();

    await sendNotification({
      userId: guardian.userId,
      channels: ['sms', 'push', 'in-app'],
      message: `Alert regarding ${elderlyUserId}: ${eventType}. Please acknowledge.`,
      priority
    });

    // Wait for acknowledgment (simulated 10 min wait, using 10s for testing/stub)
    const timeoutMs = process.env.NODE_ENV === 'production' ? 10 * 60 * 1000 : 10000;
    
    // In a real system, we'd use a robust queue (like BullMQ or Agenda) to schedule the check.
    // Here we simulate the wait.
    await wait(timeoutMs);

    // Check if acknowledged
    const updatedLog = await RelayLog.findById(log._id);
    if (updatedLog.status === 'acknowledged') {
      console.log(`[GuardianRelay] Alert acknowledged by guardian ${guardian.userId}`);
      return;
    }
    
    console.log(`[GuardianRelay] Guardian ${guardian.userId} did not acknowledge. Escalating...`);
  }

  // If we reach here, all guardians failed to acknowledge
  console.log(`[GuardianRelay] All guardians unresponsive. Escalating to Caregiver/Emergency Contact.`);
  log.status = 'failed';
  await log.save();
};

module.exports = { triggerRelay };
