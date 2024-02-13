import mongoose from "mongoose";
import Counter from "./Counter";

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
      enum: ["open", "in-progress", "pending", "resolved", "closed"],
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
    // Pre-save hook to increment the sequence for issue_id
    issue_id: {
      type: String, // Use String type for the custom format
      unique: true,
    },
  },
  {
    strictPopulate: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Pre-save hook to increment the sequence for issue_id
IssueSchema.pre("save", async function (next) {
  try {
    const doc = this;
    const counter = await Counter.findByIdAndUpdate(
      { _id: "issueId" },
      { $inc: { seq: 1 } }
    );
    if (!counter) {
      console.error("Counter document not found or null.");
      // Handle this case (create a new counter document if needed)
      // Example: await Counter.create({ _id: "issueId", seq: 1 });
    }
    doc.issue_id = `MR-${counter.seq.toString().padStart(6, "0")}`;
    next();
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    next(error);
  }
});

const Issue = mongoose.model("Issue", IssueSchema);

export default Issue;
