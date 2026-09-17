const mongoose = require('mongoose');

const knowledgeBaseEntrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  fileUrl: { type: String }, // Optional attachment/image
  category: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeBaseEntry', knowledgeBaseEntrySchema);
