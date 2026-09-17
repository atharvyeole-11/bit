const ActivityLog = require('../models/ActivityLog');

const activityLogger = (actionType) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;

    res.send = function (body) {
      // Restore original send
      res.send = originalSend;
      
      // We only log if request was somewhat successful (or based on business needs)
      if (res.statusCode >= 200 && res.statusCode < 400) {
         setImmediate(async () => {
             try {
                 const log = new ActivityLog({
                     userId: req.user ? req.user.id : null,
                     actionType,
                     metadata: {
                         method: req.method,
                         path: req.originalUrl,
                         status: res.statusCode
                     }
                 });
                 await log.save();
             } catch (err) {
                 console.error('[ActivityLogger] Failed to log activity:', err);
             }
         });
      }
      return res.send(body);
    };
    next();
  };
};

module.exports = { activityLogger };
