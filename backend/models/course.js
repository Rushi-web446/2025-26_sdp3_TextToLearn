const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        course: {
            title: { type: String, required: true },
            description: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            lastAccessedAt: { type: Date, default: Date.now },
        },
        modules: [
            {
                moduleIndex: { type: Number, required: true },
                title: { type: String, required: true },
                description: { type: String, required: true },
                estimatedTime: { type: String, required: true },
                isCompleted: { type: Boolean, default: false },
                topics: [
                    {
                        title: { type: String, required: true },
                        content: { type: String, default: "" },
                        isCompleted: { type: Boolean, default: false },
                    },
                ],
            },
        ],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
