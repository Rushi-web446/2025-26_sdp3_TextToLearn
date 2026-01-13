const mongoose = require("mongoose");

/* ---------- Lesson Schema ---------- */
const lessonSchema = new mongoose.Schema(
  {
    lessonIndex: { type: Number, required: true },

    title: { type: String, required: true },
    briefDescription: { type: String, required: true },
    estimatedTime: { type: String, required: true },

    deliverables: { type: String },

    // AI-generated lesson JSON (STRICT schema from your lesson prompt)
    content: {
      type: mongoose.Schema.Types.Mixed, // stores validated AI JSON
      default: null,
    },

    isGenerated: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
  },
  { _id: true }
);

/* ---------- Module Schema ---------- */
const moduleSchema = new mongoose.Schema(
  {
    moduleIndex: { type: Number, required: true },
    recommendedOrder: { type: Number, required: true },

    title: { type: String, required: true },
    description: { type: String, required: true },

    moduleObjective: { type: String, required: true },
    difficultyLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    estimatedTime: { type: String, required: true },

    coveredConcepts: [{ type: String }],
    excludedConcepts: [{ type: String }],

    learningOutcomes: [{ type: String }],

    topics: [{ type: String }], // outline-level topics (titles only)

    lessons: [lessonSchema],

    isCompleted: { type: Boolean, default: false },
  },
  { _id: true }
);

/* ---------- Course Schema ---------- */
const courseSchema = new mongoose.Schema(
  {
    /* ----- Course Metadata ----- */
    title: { type: String, required: true },
    description: { type: String, required: true },

    courseObjective: { type: String, required: true },
    targetAudience: { type: String, required: true },

    durationDays: { type: Number, required: true },
    estimatedTotalTime: { type: String, required: true },

    skillsGained: [{ type: String }],
    assessmentPlan: { type: String },

    /* ----- Modules ----- */
    modules: [moduleSchema],

    /* ----- Ownership ----- */
    userId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ----- Progress & Tracking ----- */
    lastAccessedAt: { type: Date, default: Date.now },
    isCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);  

module.exports = mongoose.model("Course", courseSchema);
