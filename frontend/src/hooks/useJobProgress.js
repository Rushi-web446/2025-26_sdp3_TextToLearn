import { useEffect, useState } from "react";
import api from "../api/axios";

export const useJobProgress = (getAccessTokenSilently) => {
  const [newCourse, setNewCourse] = useState(null);
  const [progressState, setProgressState] = useState("idle"); // idle, extracting, generating, creating, completed, failed
  const [isPolling, setIsPolling] = useState(false);

  const startPolling = async (previousCourses) => {
    if (!previousCourses || previousCourses.length === 0) return;

    setIsPolling(true);
    setProgressState("extracting");

    let pollCount = 0;
    const maxPolls = 120; // 5 minutes max (120 * 2.5 seconds)

    const poll = async () => {
      try {
        pollCount++;

        // Update progress state based on poll count (create meaningful UX)
        if (pollCount <= 2) {
          setProgressState("extracting");
        } else if (pollCount <= 6) {
          setProgressState("generating");
        } else {
          setProgressState("creating");
        }

        // Fetch recent courses
        const token = await getAccessTokenSilently();
        const res = await api.get("/course/recent", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const currentCourses = res.data.courses || [];

        // Compare courses to detect new one
        const newCourseDetected = detectNewCourse(previousCourses, currentCourses);

        if (newCourseDetected) {
          setNewCourse(newCourseDetected);
          setProgressState("completed");
          setIsPolling(false);
          return; // Stop polling
        }

        // Continue polling if not found and haven't exceeded max polls
        if (pollCount < maxPolls) {
          setTimeout(poll, 2500); // Poll every 2.5 seconds
        } else {
          setProgressState("failed");
          setIsPolling(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
        setProgressState("failed");
        setIsPolling(false);
      }
    };

    // Start polling
    poll();
  };

  const detectNewCourse = (previousCourses, currentCourses) => {
    // If we have more courses now, find the new ones
    if (currentCourses.length > previousCourses.length) {
      // New course(s) were added - get the first one (most recent)
      const newCourses = currentCourses.filter(
        (current) =>
          !previousCourses.some((prev) => prev.courseId === current.courseId)
      );

      if (newCourses.length > 0) {
        return newCourses[0]; // Return the newly created course
      }
    }

    // If same length but composition changed, find which one is different
    if (currentCourses.length === previousCourses.length) {
      for (let i = 0; i < currentCourses.length; i++) {
        if (currentCourses[i].courseId !== previousCourses[i]?.courseId) {
          // Course at position i is different - this is likely the new one
          return currentCourses[i];
        }
      }
    }

    return null;
  };

  const resetProgress = () => {
    setNewCourse(null);
    setProgressState("idle");
    setIsPolling(false);
  };

  return {
    newCourse,
    progressState,
    isPolling,
    startPolling,
    resetProgress,
  };
};
