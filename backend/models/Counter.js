import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define a CounterSchema for maintaining the sequence
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// Create a model for the Counter collection
const Counter = mongoose.model("Counter", CounterSchema);
export default Counter;
