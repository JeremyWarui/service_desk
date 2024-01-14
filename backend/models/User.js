import mongoose from "mongoose";

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
  password: {
    type: String,
    required: true,
  },
  user_role: {
    type: String,
    required: true,
    enum: ["user", "technician", "maintenance_officer", "admin"],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
