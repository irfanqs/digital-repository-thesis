import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Faculty {
  code: string;
  name: string;
  majors: { code: string; name: string }[];
}

const FACULTIES: Faculty[] = [
  {
    code: "FOB",
    name: "Faculty of Business",
    majors: [
      { code: "MANAGEMENT", name: "Management" },
      { code: "ACCOUNTING", name: "Accounting" },
      { code: "ECONOMICS", name: "Economics" },
    ],
  },
  {
    code: "FET",
    name: "Faculty of Engineering and Technology",
    majors: [
      { code: "CIVIL_ENG", name: "Civil Engineering" },
      { code: "ELECTRICAL_ENG", name: "Electrical Engineering" },
      { code: "MECHANICAL_ENG", name: "Mechanical Engineering" },
    ],
  },
  {
    code: "FOE",
    name: "Faculty of Education",
    majors: [
      { code: "ENGLISH_EDUCATION", name: "English Education" },
      { code: "MATHEMATICS_EDUCATION", name: "Mathematics Education" },
      { code: "EDUCATION_LEADERSHIP", name: "Education Leadership" },
    ],
  },
  {
    code: "FAS",
    name: "Faculty of Arts and Science",
    majors: [
      { code: "BIOLOGY", name: "Biology" },
      { code: "CHEMISTRY", name: "Chemistry" },
      { code: "PHYSICS", name: "Physics" },
    ],
  },
];

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [faculty, setFaculty] = useState("");
  const [program, setProgram] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedFaculty = FACULTIES.find((f) => f.code === faculty);
  const majors = selectedFaculty?.majors || [];

  const validatePassword = (pwd: string): boolean => {
    // At least 14 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    const isLongEnough = pwd.length >= 14;

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validation
      if (!email || !fullName || !studentNumber || !faculty || !program || !password) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      if (!validatePassword(password)) {
        setError(
          "Password must be at least 14 characters with uppercase, lowercase, number, and special character"
        );
        setLoading(false);
        return;
      }

      if (password !== passwordConfirm) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      // Submit registration
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          studentNumber,
          program,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Do NOT automatically navigate to dashboard/login. Show a success message
      // and let the user click through to login. This prevents accidental
      // immediate redirects if the backend creates a session or other side-effects.
      setSuccess("Registration successful! Please click 'Go to Login' to sign in.");
    } catch (err) {
      console.error("Registration error:", err);
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
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#333" }}>
            SU ETD Repository
          </h1>
          <p style={{ margin: "8px 0 0", color: "#666", fontSize: "14px" }}>
            Student Registration
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
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
              placeholder="student@my.sampoernauniversity.ac.id"
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

          {/* Full Name */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="fullName"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 500,
                color: "#333",
              }}
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="e.g., Budi Santoso"
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

          {/* Student Number */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="studentNumber"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 500,
                color: "#333",
              }}
            >
              Student ID Number
            </label>
            <input
              id="studentNumber"
              type="text"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              required
              placeholder="e.g., 2306275071"
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

          {/* Faculty and Program - Two columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            {/* Faculty */}
            <div>
              <label
                htmlFor="faculty"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                  color: "#333",
                }}
              >
                Faculty
              </label>
              <select
                id="faculty"
                value={faculty}
                onChange={(e) => {
                  setFaculty(e.target.value);
                  setProgram(""); // Reset program when faculty changes
                }}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  background: "white",
                }}
              >
                <option value="">-- Select Faculty --</option>
                {FACULTIES.map((f) => (
                  <option key={f.code} value={f.code}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Program/Major */}
            <div>
              <label
                htmlFor="program"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                  color: "#333",
                }}
              >
                Program
              </label>
              <select
                id="program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                required
                disabled={!faculty}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  background: "white",
                  opacity: !faculty ? 0.6 : 1,
                  cursor: !faculty ? "not-allowed" : "pointer",
                }}
              >
                <option value="">-- Select Program --</option>
                {majors.map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password */}
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
            <p
              style={{
                fontSize: "12px",
                color: "#666",
                marginTop: "6px",
                marginBottom: 0,
              }}
            >
              Must include: uppercase, lowercase, number, and special character (min. 14 chars)
            </p>
          </div>

          {/* Password Confirm */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="passwordConfirm"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 500,
                color: "#333",
              }}
            >
              Re-enter Password
            </label>
            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
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

          {/* Error Message */}
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

          {/* Success Message */}
          {success && (
            <div
              style={{
                padding: "12px",
                marginBottom: "20px",
                background: "#efe",
                border: "1px solid #cfc",
                borderRadius: "6px",
                color: "#3c3",
                fontSize: "14px",
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ flex: 1 }}>{success}</span>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: '#1f6fb2',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Submit Button */}
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
            {loading ? "Registering..." : "Register"}
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
            Already have an account?{" "}
            <a
              href="/login"
              style={{ color: "#1f6fb2", textDecoration: "none", fontWeight: 600 }}
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
