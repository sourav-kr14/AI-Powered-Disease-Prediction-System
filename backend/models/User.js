const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
      type: String,
      default: "",
    },
    profile: {
      age: { type: Number, default: 25 },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "male",
      },
      weight: { type: Number, default: 70 }, // kg
      height: { type: Number, default: 175 }, // cm
      activityLevel: {
        type: String,
        enum: ["sedentary", "light", "moderate", "active", "intense"],
        default: "moderate",
      },
      goal: {
        type: String,
        enum: ["maintain", "loss", "gain"],
        default: "maintain",
      },
      bloodGroup: { type: String, default: "O+" },
      allergies: { type: [String], default: [] },
    },
    vitals: {
      waterIntakeGlasses: { type: Number, default: 0 },
      waterGoalGlasses: { type: Number, default: 8 },
      lastWaterReset: { type: String, default: "" },
      checklist: {
        vitamins: { type: Boolean, default: false },
        workout: { type: Boolean, default: false },
        hydration: { type: Boolean, default: false },
        sleep: { type: Boolean, default: false },
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);
