const {saveCourseForUserService} = require("../services/user.service");

const saveCourseForUser = async (req, res) => {
    const {userId, courseId} = req.body;
    try {
        await saveCourseForUserService(userId, courseId);
        return res.status(201).json({ message: "success."});
    } catch(error) {
        return res.status(400).json({ message:"Error occure"});
    }
};

module.exports = {saveCourseForUser};