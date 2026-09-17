const Reminder = require('../models/Reminder');

const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id });
    res.status(200).json({ success: true, data: reminders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const createReminder = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const reminder = await Reminder.create(req.body);
    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateReminder = async (req, res) => {
  try {
    let reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    if (reminder.userId.toString() !== req.user.id) return res.status(401).json({ error: 'Not authorized' });

    reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: reminder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    if (reminder.userId.toString() !== req.user.id) return res.status(401).json({ error: 'Not authorized' });

    await reminder.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = { getReminders, createReminder, updateReminder, deleteReminder };
