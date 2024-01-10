import mongoose from "mongoose";

const Schema = mongoose.Schema;

const IssueSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
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
          type: mongoose.Schema.Types.ObjectId, 
          required: true,
          ref: "User",
        },
        assigned_date: {
          type: Date,
          required: true,
        },
      },
    ],
    
  },
  {
    strictPopulate: false, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Issue = mongoose.model("Issue", IssueSchema);

export default Issue;
