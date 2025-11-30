import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Supervisee {
  studentId: number;
  fullName: string;
  email: string;
  submissionCount: number;
  lastSubmission?: string;
}

function SuperviseeThesesSection() {
  const navigate = useNavigate();
  const [supervisees, setSupervisees] = useState<Supervisee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/lecturers/my-supervisees", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to load supervisees (HTTP ${res.status})`);
        }

        const data = (await res.json()) as Supervisee[];
        setSupervisees(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? "Failed to load supervisees");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleViewProfile = (studentId: number) => {
    navigate(`/lecturer/supervisee/${studentId}`);
  };

  return (
    <div className="card">
      <div className="card-title">Supervisees</div>
      <div className="card-subtitle">
        View and manage students who have assigned you as their supervisor.
      </div>

      {loading && <p>Loading...</p>}
      {error && !loading && <p style={{ color: "#d32f2f" }}>{error}</p>}

      {!loading && !error && (
        <>
          {supervisees.length === 0 ? (
            <p>No supervisees assigned yet.</p>
          ) : (
            <div style={{ marginTop: 16 }}>
              {supervisees.map((supervisee) => (
                <div
                  key={supervisee.studentId}
                  style={{
                    padding: "16px",
                    border: "1px solid #e9ecef",
                    borderRadius: "6px",
                    marginBottom: "12px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f8f9fa";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#495057";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#e9ecef";
                  }}
                  onClick={() => handleViewProfile(supervisee.studentId)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "4px" }}>
                        {supervisee.fullName}
                      </div>
                      <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
                        {supervisee.email}
                      </div>
                      <div style={{ fontSize: "12px", color: "#999" }}>
                        Submissions: {supervisee.submissionCount}
                        {supervisee.lastSubmission && (
                          <> • Last: {supervisee.lastSubmission}</>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#e7f5ff",
                        color: "#1971c2",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      View Profile
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SuperviseeThesesSection;
