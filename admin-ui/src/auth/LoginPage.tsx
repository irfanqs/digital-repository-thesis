import { FormEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success && result.user) {
        // Check if there's a saved location from ProtectedRoute
        const from = (location.state as any)?.from?.pathname || `/${result.user.role.toLowerCase()}/dashboard`;
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b3c68, #1f6fb2)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#333" }}>
            SU ETD Repository
          </h1>
          <p style={{ margin: "8px 0 0", color: "#666", fontSize: "14px" }}>
            Electronic Theses & Dissertations
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 500,
                color: "#333",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@univ.local"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 500,
                color: "#333",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: "12px",
                marginBottom: "20px",
                background: "#fee",
                border: "1px solid #fcc",
                borderRadius: "6px",
                color: "#c33",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#999" : "#667eea",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.background = "#0b3c68";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.background = "#1f6fb2";
              }
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "14px",
            color: "#666",
          }}
        >
          <p style={{ margin: 0 }}>
            Need an account?{" "}
            <a
              href="/register"
              style={{ color: "#1f6fb2", textDecoration: "none" }}
            >
              Register here
            </a>
          </p>
        </div>

        {/* <div
          style={{
            marginTop: "30px",
            padding: "16px",
            background: "#f7f9fc",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Demo Accounts:</p>
          <p style={{ margin: "4px 0" }}>
            <strong>Admin:</strong> admin@univ.local / Admin123!
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Lecturer:</strong> lecturer@univ.local / Lecturer123!
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default LoginPage;
