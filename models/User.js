import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  user_role: {
    type: String,
    required: true,
    enum: ['user', 'technician', 'maintenance_officer'],
  },
  department: {
    type: String,
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
