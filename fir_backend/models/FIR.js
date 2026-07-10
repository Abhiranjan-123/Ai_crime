const mongoose = require('mongoose');

const FIRSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complainantName: { type: String, required: true },
  incidentType: { type: String, required: true },
  location: { type: String, required: true },
  incidentDate: { type: String, required: true }, // Format: YYYY-MM-DD
  incidentTime: { type: String, required: true }, // Format: HH:MM (24hr or AM/PM)
  description: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  filedAt: { type: String, default: () => new Date().toISOString().split('T')[0] } 
});

module.exports = mongoose.model('FIR', FIRSchema);