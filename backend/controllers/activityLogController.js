const ActivityLog = require('../models/ActivityLog');

const getActivityLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { userId };
    
    if (type) query.actionType = type;
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const startIndex = (page - 1) * limit;

    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(startIndex)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: logs.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      },
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = { getActivityLogs };
