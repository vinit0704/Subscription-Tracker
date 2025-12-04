// models/User.js
import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "Web Services" },
    cost: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    billingFrequency: {
      type: String,
      enum: ["Monthly", "Yearly", "Quarterly", "One-time"],
      default: "Monthly",
    },
    paymentMethod: { type: String, default: "Credit Card" },
    startDate: { type: String }, // "yyyy-mm-dd"
    renewalType: { type: String, default: "Automatic" },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Active", "Paused", "Cancelled"],
      default: "Active",
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    subscriptions: { type: [SubscriptionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
