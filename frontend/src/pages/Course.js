import { useLocation, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import useCourseDetails from "../hooks/useCourseDetails";
import useCheckLessonExist from "../hooks/useCheckLessonExist";
import useGenerateLesson from "../hooks/useGenerateLesson";
import useSaveLesson from "../hooks/useSaveLesson";
import useGetCurrentLesson from "../hooks/useGetCurrentLesson";
import useGetYouTubeVideos from "../hooks/useGetYouTubeVideos";

import LessonViewer from "../components/lesson/LessonViewer";

const Course = () => {
  const location = useLocation();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const courseId = location.state?.courseId;

  // 1️⃣ course progress
  const courseState = useCourseDetails(
    isAuthenticated,
    getAccessTokenSilently,
    courseId
  );

  const { currentModuleIndex, currentLessonIndex } = courseState;

  // 2️⃣ check lesson exists
  const lessonExistState = useCheckLessonExist(
    isAuthenticated,
    getAccessTokenSilently,
    courseId,
    currentModuleIndex,
    currentLessonIndex
  );

  // 3️⃣ generate lesson (ONLY if not exists)
  const generatedLessonState = useGenerateLesson(
    isAuthenticated,
    getAccessTokenSilently,
    courseId,
    currentModuleIndex,
    currentLessonIndex,
    lessonExistState.exists
  );

  // 4️⃣ save generated lesson (ONLY if newly generated)
  const saveLessonState = useSaveLesson(
    isAuthenticated,
    getAccessTokenSilently,
    courseId,
    currentModuleIndex,
    currentLessonIndex,
    generatedLessonState.data,
    lessonExistState.exists
  );

  // 5️⃣ fetch current lesson (after save OR if already existed)
  const currentLessonState = useGetCurrentLesson(
    isAuthenticated,
    getAccessTokenSilently,
    courseId,
    currentModuleIndex,
    currentLessonIndex,
    saveLessonState.saved || lessonExistState.exists
  );

  // 6️⃣ youtube videos
  const youtubeState = useGetYouTubeVideos(
    isAuthenticated,
    getAccessTokenSilently,
    courseId,
    currentModuleIndex,
    currentLessonIndex
  );

  if (!courseId) return <Navigate to="/" replace />;


  if (
    courseState.loading ||
    lessonExistState.loading ||
    generatedLessonState.loading ||
    saveLessonState.loading ||
    currentLessonState.loading ||
    youtubeState.loading
  ) {
    return <h2>Loading lesson...</h2>;
  }

  if (courseState.error) return <h2>{courseState.error}</h2>;
  if (currentLessonState.error) return <h2>{currentLessonState.error}</h2>;

const normalizedLesson = currentLessonState.lesson
  ? {
      ...currentLessonState.lesson.content,
      title: currentLessonState.lesson.title,
      isCompleted: currentLessonState.lesson.isCompleted,
      lessonIndex: currentLessonState.lesson.lessonIndex,
    }
  : null;

return (
  <LessonViewer
    course={courseState.course}
    lesson={normalizedLesson}
    youtubeVideos={youtubeState.videos}
    onNext={courseState.goToNextLesson}
  />
);
};

export default Course;
