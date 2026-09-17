const KnowledgeBaseEntry = require('../models/KnowledgeBaseEntry');

const getEntries = async (req, res) => {
  try {
    const entries = await KnowledgeBaseEntry.find();
    res.status(200).json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const createEntry = async (req, res) => {
  try {
    req.body.uploadedBy = req.user.id;
    const entry = await KnowledgeBaseEntry.create(req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const entry = await KnowledgeBaseEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    
    if (req.user.role !== 'admin' && entry.uploadedBy.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    await entry.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = { getEntries, createEntry, deleteEntry };
