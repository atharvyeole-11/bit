const QueueToken = require('../models/QueueToken');
const { sendNotification } = require('../services/notificationEngine');
const { getIo } = require('../sockets');

const joinQueue = async (req, res) => {
  try {
    const { serviceId } = req.body;
    
    // Find the highest token number for this service
    const lastToken = await QueueToken.findOne({ serviceId }).sort({ tokenNumber: -1 });
    const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    // Calculate estimated wait time (stub logic: 10 mins per person ahead)
    const peopleAhead = await QueueToken.countDocuments({ serviceId, status: 'waiting' });
    const estimatedWaitTime = (peopleAhead + 1) * 10;

    const token = await QueueToken.create({
      serviceId,
      userId: req.user.id,
      tokenNumber,
      estimatedWaitTime
    });

    // Emit live update
    const io = getIo();
    if (io) {
      io.of('/queue').emit('queue_update', { serviceId, peopleWaiting: peopleAhead + 1 });
    }

    res.status(201).json({ success: true, data: token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getQueueStatus = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const tokens = await QueueToken.find({ serviceId, status: 'waiting' }).sort({ tokenNumber: 1 });
    
    // Find user's position if they are in queue
    const userTokenIndex = tokens.findIndex(t => t.userId.toString() === req.user.id);
    
    let userPosition = null;
    let userToken = null;
    
    if (userTokenIndex !== -1) {
      userPosition = userTokenIndex + 1;
      userToken = tokens[userTokenIndex];
      
      // Notify if position is <= 2
      if (userPosition <= 2) {
        await sendNotification({
          userId: req.user.id,
          channels: ['in-app', 'push'],
          message: `It's almost your turn! You are number ${userPosition} in the queue for ${serviceId}.`
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        serviceId,
        totalWaiting: tokens.length,
        userPosition,
        estimatedWaitTime: userToken ? userToken.estimatedWaitTime : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = { joinQueue, getQueueStatus };
