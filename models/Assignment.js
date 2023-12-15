import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
  technician_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  issue_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Issue',
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
      type: Schema.Types.ObjectId,
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