// src/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import ShellLayout from "../layout/ShellLayout";
import type { Me } from "../lib/types/user";

interface Props {
  me: Me;
}

interface Submission {
  submissionId: number;
  studentName: string;
  thesisTitle: string;
  status: string;
  submittedDate: string;
}

function AdminDashboard({ me }: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/submissions", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to load submissions (HTTP ${res.status})`);
        }

        const data = (await res.json()) as Submission[];
        setSubmissions(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "--" || status === "Pending") return "#868e96";
    if (status.includes("Revision")) return "#ffa94d";
    if (status === "Approved") return "#51cf66";
    return "#868e96";
  };

  return (
    <ShellLayout
      me={me}
      title="Dashboard"
      subtitle="Library admin portal – review, approve, and publish theses."
      activeNav="dashboard"
    >
      <div className="card">
        <div className="card-title">Recent Submissions</div>
        <div className="card-subtitle">
          Thesis submissions pending review or already reviewed
        </div>

        {loading && <p style={{ marginTop: 12 }}>Loading submissions...</p>}
        {error && !loading && (
          <p style={{ marginTop: 12, color: "#d32f2f" }}>{error}</p>
        )}

        {!loading && !error && (
          <div style={{ marginTop: 16 }}>
            {submissions.length === 0 ? (
              <p style={{ color: "#666" }}>No submissions yet.</p>
            ) : (
              <div>
                {submissions.map((submission) => (
                  <div
                    key={submission.submissionId}
                    style={{
                      padding: "12px",
                      border: "1px solid #e9ecef",
                      borderRadius: "6px",
                      marginBottom: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                        {submission.thesisTitle}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                        Author: {submission.studentName}
                      </div>
                      <div style={{ fontSize: "12px", color: "#999" }}>
                        Submitted: {submission.submittedDate}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        backgroundColor: getStatusColor(submission.status),
                        color: "white",
                        fontSize: "12px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {submission.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ShellLayout>
  );
}

export default AdminDashboard;
