const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  file_id: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  access_time: { type: Date, default: Date.now },
  success: { type: Boolean, default: false },
  requester_ip: { type: String }
});

module.exports = mongoose.model('AccessLog', accessLogSchema);
