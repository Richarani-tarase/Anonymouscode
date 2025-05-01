const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
  message: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const SOS = mongoose.model('SOS', sosSchema);

module.exports = SOS;
