const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: false },
  data : {type:Buffer},
  encrypted_file: { type: Buffer, required: true },  
  encryption_key: { type: String }, 
  expiry: { type: Date },
  max_downloads: { type: Number, default: 5 },
  downloads_left: { type: Number, default: 5 },
  password_hash: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
