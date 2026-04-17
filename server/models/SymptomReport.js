import mongoose from "mongoose";

const symptomReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    symptoms: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      min: 0,
    },

    gender: {
      type: String,
      trim: true,
    },

    duration: {
      type: String,
      trim: true,
    },

    severity: {
      type: Number,
      min: 1,
      max: 10,
    },

    additionalDetails: {
      type: String,
      trim: true,
      default: "",
    },

    dosha: {
      type: String,
      enum: ["Vata", "Pitta", "Kapha", "Mixed"],
      required: true,
    },

    reasoning: {
      type: String,
      required: true,
    },

    remedies: {
      type: [String],
      required: true,
    },

    immediateSolutions: {
      type: [String],
      default: [],
    },

    therapies: {
      type: [
        {
          name: { type: String, required: true },
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },

    dietRecommendations: [String],
    lifestyleRecommendations: [String],

    aiModelVersion: {
      type: String,
      default: "v1",
    },

    isAnonymous: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SymptomReport", symptomReportSchema);
