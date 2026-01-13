// // frontend/src/App.js
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useEffect } from "react";
// import Home from "./pages/Home";
// import Course from "./pages/Course";

// import LoginRedirect from "./pages/LoginRedirect";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { useAuth0 } from "@auth0/auth0-react";


// function App() {
//   const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

//   // // Sync user with backend
//   // useEffect(() => {
//   //   const syncUser = async () => {
//   //     console.log("App: checking auth status", isAuthenticated);
//   //     if (isAuthenticated) {
//   //       try {
//   //         console.log("App: getting token...");
//   //         const token = await getAccessTokenSilently();
//   //         console.log("App: token received");

//   //         console.log("App: calling sync...");
//   //         const res = await fetch("http://localhost:3001/user/sync", {
//   //           method: "POST",
//   //           headers: {
//   //             "Content-Type": "application/json",
//   //             "Authorization": `Bearer ${token}`
//   //           },
//   //         });
//   //         const data = await res.json();
//   //         console.log("App: sync response", res.status, data);

//   //       } catch (error) {
//   //         console.error("User sync failed:", error);
//   //       }
//   //     }
//   //   };

//   //   syncUser();
//   // }, [isAuthenticated, getAccessTokenSilently]);

//   // if (isLoading) {
//   //   return <div>Loading...</div>;
//   // }

//   return (
//     <Router>
//       <Routes>
//         {/* Default route */}
//         <Route
//           path="/"
//           element={
//             isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
//           }
//         />

//         {/* Auth0 login */}
//         <Route path="/login" element={<LoginRedirect />} />

//         {/* Protected pages */}
//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />



//       </Routes>
//     </Router>
//   );
// }

// export default App;



import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Home from "./pages/Home";
import LoginRedirect from "./pages/LoginRedirect";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
      />
      <Route path="/login" element={<LoginRedirect />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
