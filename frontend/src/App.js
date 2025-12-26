// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Course from "./pages/Course"; // Change this line


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/course" element={<Course />} />

        {/* other routes */}
      </Routes>
    </Router>
  );
}

export default App;
