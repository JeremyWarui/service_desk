import mongoose from "mongoose";

const Schema = mongoose.Schema;

const IssueSchema = new Schema(
  {
    category_id: {
      type: Schema.Types.ObjectId,
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
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        assigned_date: {
          type: Date,
        },
      },
    ],
    open_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    resolved_date: {
      type: Date,
    },
    closed_date: {
      type: Date,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    strictPopulate: false, // Set the strictPopulate option to false
  }
);

const Issue = mongoose.model("Issue", IssueSchema);

export default Issue;
