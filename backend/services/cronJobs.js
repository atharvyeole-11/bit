const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const { sendNotification } = require('./notificationEngine');
const { triggerRelay } = require('./guardianRelay');

// Check every minute for due reminders
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    // Find pending reminders that are due
    const dueReminders = await Reminder.find({
      status: 'pending',
      datetime: { $lte: now }
    });

    for (const reminder of dueReminders) {
      console.log(`[Cron] Processing due reminder: ${reminder._id}`);
      
      // Notify the user
      await sendNotification({
        userId: reminder.userId,
        channels: ['in-app', 'push', 'sms'],
        message: reminder.message || `Reminder: ${reminder.type}`,
        priority: 'high'
      });

      // Optionally, mark as missed if past a grace period (e.g., 10 mins)
      const gracePeriod = new Date(now.getTime() - 10 * 60000);
      if (reminder.datetime < gracePeriod) {
        reminder.status = 'missed';
        await reminder.save();
        
        // Trigger relay for missed reminder
        await triggerRelay({
          elderlyUserId: reminder.userId,
          eventType: `missed_reminder_${reminder.type}`,
          priority: 'high',
          context: { reminderId: reminder._id }
        });
      }
    }
  } catch (error) {
    console.error('[Cron] Error processing reminders:', error);
  }
});

console.log('Cron jobs initialized');
