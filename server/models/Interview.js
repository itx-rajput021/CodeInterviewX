const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  candidateId: { type: String, required: true },
  candidateName: { type: String, required: true },
  interviewerId: { type: String, required: true },
  interviewerName: { type: String, default: '' },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 60, min: 15, max: 240 },
  status: { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' },
  roomCode: { type: String, required: true, unique: true },
  initialCode: { type: String, default: '// Write your solution here\n' },
  language: { type: String, default: 'javascript' },
}, { timestamps: true });

module.exports = mongoose.models.Interview || mongoose.model('Interview', interviewSchema);
