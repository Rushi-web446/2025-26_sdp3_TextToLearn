import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuthSync } from "../hooks/useAuthSync";
import { useRecentCourses } from "../hooks/useRecentCourses";
import { useCourseGeneration } from "../hooks/useCourseGeneration";

const Home = () => {


  const location = useLocation();

  const navigate = useNavigate();
  const { user, logout, isAuthenticated, getAccessTokenSilently,} = useAuth0();

  const [prompt, setPrompt] = useState("");

  // 🔐 Sync user
const userReady = useAuthSync(isAuthenticated, getAccessTokenSilently, user);



const { courses, loading: coursesLoading } = useRecentCourses(
  isAuthenticated,
  userReady,
  getAccessTokenSilently,
  location.key // 👈 THIS is the trigger
);

  // ⚙️ Course generation
  const { generateCourse, loading, error } = useCourseGeneration(
    getAccessTokenSilently
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (prompt.trim().split(/\s+/).length < 5) {
      alert("Enter at least 5 words");
      return;
    }

    const courseId = await generateCourse(prompt);
    navigate("/course", { state: { courseId } });
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h1>Welcome {user?.name}</h1>

      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Logout
      </button>

      <hr />

      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          placeholder="Describe what you want to learn..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />

        <button disabled={loading} style={{ marginTop: "10px" }}>
          {loading ? "Generating..." : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      <h3>My Courses</h3>

      {coursesLoading && <p>Loading courses...</p>}

      {!coursesLoading && courses.length === 0 && <p>No courses yet</p>}

      {courses.map((course) => (
        <div
          key={course.courseId}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
          onClick={() =>
            navigate("/course", {
              state: {
                courseId: course.courseId, // 👈 hidden state
              },
            })
          }
        >
          <h4>{course.courseTitle}</h4>
          <p>{course.courseDescription}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
