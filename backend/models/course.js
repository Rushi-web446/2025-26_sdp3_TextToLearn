const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        course: {
            title: { type: String, required: true },
            description: { type: String, required: true },
        },
        modules: [
            {
                moduleIndex: { type: Number, required: true },
                title: { type: String, required: true },
                description: { type: String, required: true },
                estimatedTime: { type: String, required: true },
                topics: [
                    {
                        title: { type: String, required: true },
                        content: { type: String, default: "" },
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
