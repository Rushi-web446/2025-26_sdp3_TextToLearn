import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Course() {
  const location = useLocation();
  const [courseData, setCourseData] = useState(location.state?.courseData);

  useEffect(() => {
    // If we have data in state, save it to localStorage
    if (location.state?.courseData) {
      localStorage.setItem('lastCourse', JSON.stringify(location.state.courseData));
      setCourseData(location.state.courseData);
    } else {
      // If state is missing (refresh), try loading from localStorage
      const savedCourse = localStorage.getItem('lastCourse');
      if (savedCourse) {
        setCourseData(JSON.parse(savedCourse));
      }
    }
  }, [location.state]);

  if (!courseData && !localStorage.getItem('lastCourse')) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>No course data found</h2>
        <p>Please generate a course first.</p>
        <button onClick={() => window.location.href = '/home'}>Go Home</button>
      </div>
    );
  }

  // Access data directly from the root structure
  const title = courseData.course?.title || "Untitled Course";
  const description = courseData.course?.description || "No description available";
  const modules = courseData.modules || [];

  let currentModule = 1;

  const getStarted = async () => {
    try {
      const res = await fetch(`http://localhost:3001/courses/generate/${currentModule}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseData.course._id,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Course started:", data);
    } catch (error) {
      console.error("Failed to start course:", error);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{title}</h1>
      <p><strong>Description:</strong> {description}</p>


      <button onClick={getStarted} style={{
        padding: '12px 24px',
        fontSize: '18px',
        backgroundColor: '#bb86fc',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        margin: '20px 0'
      }}>
        Start Course
      </button>

      <br /><br />

      <div style={{ marginTop: '30px' }}>
        <h3>Modules:</h3>
        {Array.isArray(modules) && modules.length > 0 ? (
          <div>
            {modules.map((module, index) => (
              <div key={index} style={{
                border: '1px solid #ddd',
                padding: '15px',
                marginBottom: '15px',
                borderRadius: '8px'
              }}>
                <h4>Module {module.moduleIndex}: {module.title}</h4>
                <p><strong>Description:</strong> {module.description}</p>
                <p><strong>Estimated Time:</strong> {module.estimatedTime}</p>

                <div style={{ marginTop: '10px' }}>
                  <h5>Topics:</h5>
                  <ul>
                    {module.topics?.map((topic, i) => (
                      <li key={i}>{topic.title || topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No modules available</p>
        )}

      </div>
    </div>
  );
}

export default Course;