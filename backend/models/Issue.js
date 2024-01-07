import mongoose from "mongoose";

const Schema = mongoose.Schema;

const IssueSchema = new Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId, // Use mongoose.Schema.Types.ObjectId instead of mongoose.ObjectId
      required: true,
      ref: "Category",
    },
    issue_message: {
      type: String,
      required: true,
    },
    issue_status: {
      type: String,
      required: true,
      enum: ["open", "in-progress", "resolved", "closed"],
    },
    issue_resolution: {
      type: String,
    },
    assignment_history: [
      {
        assigned_to: {
          type: mongoose.Schema.Types.ObjectId, // Use mongoose.Schema.Types.ObjectId instead of mongoose.ObjectId
          required: true, // Add required: true
          ref: "User",
        },
        assigned_date: {
          type: Date,
          required: true, // Add required: true
        },
      },
    ],
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Use mongoose.Schema.Types.ObjectId instead of mongoose.ObjectId
      required: true,
      ref: "User",
    },
    // Use a virtual field for the user reference
    user: {
      type: mongoose.Schema.Types.ObjectId, // Use mongoose.Schema.Types.ObjectId instead of mongoose.ObjectId
      ref: "User",
      localField: "user_id",
      foreignField: "_id",
    },
  },
  {
    strictPopulate: false, // Set the strictPopulate option to false
    toJSON: { virtuals: true }, // Include virtual fields in JSON output
    toObject: { virtuals: true }, // Include virtual fields in Object output
    timestamps: true, // Add timestamps: true
  }
);

const Issue = mongoose.model("Issue", IssueSchema);

export default Issue;
