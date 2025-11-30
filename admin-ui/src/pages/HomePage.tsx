import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Thesis {
  id: number;
  title: string;
  studentName: string;
  supervisorName: string;
  program: string;
  year: number;
  abstractText: string;
}

function HomePage() {
  const navigate = useNavigate();
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTheses = async () => {
      try {
        const res = await fetch("/api/public/theses");
        if (res.ok) {
          const data = await res.json();
          setTheses(data);
        }
      } catch (err) {
        console.error("Failed to fetch theses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTheses();
  }, []);

  const filteredTheses = theses.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      {/* Header with Login button */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
            SU ETD Repository
          </h1>
          <span style={{ fontSize: "12px", color: "#6b7280" }}>
            Sampoerna University
          </span>
        </div>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "8px 20px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "60px 32px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 700,
            marginBottom: "12px",
            lineHeight: 1.2,
          }}
        >
          Welcome to Sampoerna University
          <br />
          Electronic Theses &amp; Dissertations Repository
        </h1>
        <p
          style={{
            fontSize: "16px",
            marginBottom: "24px",
            opacity: 0.9,
            maxWidth: "600px",
            margin: "0 auto 24px",
          }}
        >
          Explore academic research and scholarly works from our students and faculty
        </p>
      </section>

      {/* Search Section */}
      <section style={{ background: "white", padding: "32px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}>
            Browse Theses & Dissertations
          </h2>
          <input
            type="text"
            placeholder="Search by title, author, supervisor, or program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              outline: "none",
            }}
          />
          <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
            {filteredTheses.length} {filteredTheses.length === 1 ? "thesis" : "theses"} found
          </p>
        </div>
      </section>

      {/* Results Section */}
      <section style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>Loading theses...</p>
        ) : filteredTheses.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>No theses found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredTheses.map((thesis) => (
              <div
                key={thesis.id}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px", color: "#111827" }}>
                  {thesis.title}
                </h3>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Author:</strong> {thesis.studentName}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Supervisor:</strong> {thesis.supervisorName}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Program:</strong> {thesis.program} • <strong>Year:</strong> {thesis.year}
                  </p>
                </div>
                <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.6 }}>
                  {thesis.abstractText}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#1f2937",
          color: "white",
          padding: "32px",
          textAlign: "center",
          marginTop: "60px",
        }}
      >
        <p style={{ fontSize: "14px", marginBottom: "8px" }}>
          © 2025 Sampoerna University - Electronic Theses &amp; Dissertations Repository
        </p>
        <p style={{ fontSize: "12px", color: "#9ca3af" }}>
          All rights reserved
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
