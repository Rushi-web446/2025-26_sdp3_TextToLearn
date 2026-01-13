import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import api from "../api/axios";

const Home = () => {
  const { user, getAccessTokenSilently, logout, isAuthenticated } = useAuth0();

  // UI state
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Purpose:
   * Sync Auth0 user with backend DB
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncUser = async () => {
      try {
        const token = await getAccessTokenSilently();
        await api.get("/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("User sync failed", err);
      }
    };

    syncUser();
  }, [isAuthenticated, getAccessTokenSilently]);

  /**
   * Handle submit of input box
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (prompt.trim().split(/\s+/).length < 5) {
      setError("Please enter at least 5 words.");
      return;
    }

    try {
      setLoading(true);

      const token = await getAccessTokenSilently();

      const res = await api.post(
        "/course/generate",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Generated course:", res.data);

      alert(`\n : \n ${res.data} \n : \n`);

      // later → navigate or store result

    } catch (err) {
      console.error(err);
      setError("Failed to generate course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>Welcome {user?.name}</h1>

      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Logout
      </button>

      <hr style={{ margin: "2rem 0" }} />

      {/* Input + Submit */}
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          placeholder="Describe what you want to learn..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "15px" }}
        >
          {loading ? "Generating..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Home;
