import { useEffect, useState } from "react";
import api from "../api/axios";

const useGetCurrentLesson = (
  isAuthenticated,
  getAccessTokenSilently,
  courseId,
  moduleIndex,
  lessonIndex,
  refreshKey
) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      !isAuthenticated ||
      !courseId ||
      moduleIndex === undefined ||
      lessonIndex === undefined ||
      !refreshKey
    ) {
      return;
    }

    const fetchLesson = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();

        const res = await api.get(
          `/course/get/lesson/${courseId}`,
          {
            params: { moduleIndex, lessonIndex },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLesson(res.data.lesson); // ✅ THIS WAS MISSING EFFECT
      } catch (err) {
        console.error(err);
        setError("Failed to fetch lesson content");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [
    isAuthenticated,
    getAccessTokenSilently,
    courseId,
    moduleIndex,
    lessonIndex,
    refreshKey,
  ]);

  return { lesson, loading, error };
};

export default useGetCurrentLesson;
