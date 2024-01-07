import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Issue',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'assigned', 'in-progress', 'completed'],
  },
  priority: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date,
  },
  assigned_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    sent_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  }],
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);

export default Assignment;