const Course = require("../models/course");

/**
 * Get the top 3 most recently accessed courses for the authenticated user.
 */
const getRecentCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        const recentCourses = await Course.find({ userId })
            .sort({ "course.lastAccessedAt": -1 })
            .limit(3)
            .select("course.title course.description _id");

        res.status(200).json({
            success: true,
            courses: recentCourses.map(c => ({
                courseId: c._id,
                courseTitle: c.course.title,
                courseDescription: c.course.description,
            })),
        });
    } catch (err) {
        console.error("ERROR FETCHING RECENT COURSES:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * Get details of a specific course and calculate user progress.
 */
const getCourseDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const course = await Course.findOne({ _id: id, userId });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Update last access time
        course.course.lastAccessedAt = Date.now();
        await course.save();

        // Calculate current progress
        let currentModuleIndex = 0;
        for (let i = 0; i < course.modules.length; i++) {
            if (course.modules[i].isCompleted) {
                currentModuleIndex = i + 1;
            } else {
                break;
            }
        }

        let currentTopicIndex = 0;
        if (currentModuleIndex > 0) {
            const targetModule = course.modules[currentModuleIndex - 1];
            let lastCompletedTopicIndex = 0;
            for (let j = 0; j < targetModule.topics.length; j++) {
                if (targetModule.topics[j].isCompleted) {
                    lastCompletedTopicIndex = j + 1;
                } else {
                    break;
                }
            }

            // If all topics are completed, choose last topic. If not, the current one is the one AFTER the last completed.
            // Wait, user said: "If for that current module if all the topics are complete then we will choose last topic as our current topic."
            if (lastCompletedTopicIndex === targetModule.topics.length && targetModule.topics.length > 0) {
                currentTopicIndex = targetModule.topics.length;
            } else {
                // If some are incomplete, the "current" one is the first uncompleted one (lastCompleted + 1)
                currentTopicIndex = Math.min(lastCompletedTopicIndex + 1, targetModule.topics.length);
            }
        }

        res.status(200).json({
            success: true,
            course,
            progress: {
                currentModule: currentModuleIndex,
                currentTopic: currentTopicIndex,
            },
        });
    } catch (err) {
        console.error("ERROR FETCHING COURSE DETAILS:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * Get content for a specific topic in a course module.
 */
const getTopicContent = async (req, res) => {
    try {
        const { id, moduleIndex, topicIndex } = req.params;
        const userId = req.user.id;

        const course = await Course.findOne({ _id: id, userId });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const targetModule = course.modules.find(m => m.moduleIndex === parseInt(moduleIndex));
        if (!targetModule) {
            return res.status(404).json({ success: false, message: "Module not found" });
        }

        // topicIndex is 1-indexed from user perspective
        const topicIdx = parseInt(topicIndex) - 1;
        const targetTopic = targetModule.topics[topicIdx];

        if (!targetTopic) {
            return res.status(404).json({ success: false, message: "Topic not found" });
        }

        res.status(200).json({
            success: true,
            topic: {
                title: targetTopic.title,
                content: targetTopic.content,
                isCompleted: targetTopic.isCompleted,
                moduleTitle: targetModule.title,
                moduleIndex: targetModule.moduleIndex,
                topicIndex: parseInt(topicIndex)
            }
        });

    } catch (err) {
        console.error("ERROR FETCHING TOPIC CONTENT:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * Mark a topic as completed and get the next navigation point.
 */
const completeTopicAndGetNext = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentModuleIndex, currentTopicIndex } = req.body;
        const userId = req.user.id;

        const course = await Course.findOne({ _id: id, userId });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const cModIdx = parseInt(currentModuleIndex);
        const cTopIdx = parseInt(currentTopicIndex);

        // 1. Mark current topic as completed
        const targetModule = course.modules.find(m => m.moduleIndex === cModIdx);
        if (!targetModule) {
            return res.status(404).json({ success: false, message: "Module not found" });
        }

        const targetTopic = targetModule.topics[cTopIdx - 1];
        if (!targetTopic) {
            return res.status(404).json({ success: false, message: "Topic not found" });
        }

        targetTopic.isCompleted = true;

        // 2. Check if all topics in this module are completed, if so mark module as completed
        const allTopicsCompleted = targetModule.topics.every(t => t.isCompleted);
        if (allTopicsCompleted) {
            targetModule.isCompleted = true;
        }

        await course.save();

        // 3. Calculate Next
        let nextModule = cModIdx;
        let nextTopic = cTopIdx + 1;
        let courseCompleted = false;

        // If current topic was the last in the module
        if (cTopIdx >= targetModule.topics.length) {
            // If there's a next module
            if (cModIdx < course.modules.length) {
                nextModule = cModIdx + 1;
                nextTopic = 1;
            } else {
                // Entire course completed
                courseCompleted = true;
                nextModule = cModIdx; // Stay on last
                nextTopic = cTopIdx;   // Stay on last
            }
        }

        res.status(200).json({
            success: true,
            message: courseCompleted ? "Congratulations! Course completed!" : "Topic completed",
            courseCompleted,
            nextModule,
            nextTopic
        });

    } catch (err) {
        console.error("ERROR COMPLETING TOPIC:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    getRecentCourses,
    getCourseDetails,
    getTopicContent,
    completeTopicAndGetNext,
};
