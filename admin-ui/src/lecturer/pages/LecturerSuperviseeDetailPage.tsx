import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ShellLayout from "../../layout/ShellLayout";
import type { Me } from "../../lib/types/user";

interface Props {
  me: Me;
}

interface SuperviseeDetail {
  studentId: number;
  fullName: string;
  email: string;
  faculty: string;
  major: string;
}

interface Submission {
  submissionId: number;
  title: string;
  status: string;
  submittedDate: string;
  lastUpdated: string;
}

function LecturerSuperviseeDetailPage({ me }: Props) {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [supervisee, setSupervisee] = useState<SuperviseeDetail | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Load supervisee detail
        const superviseeRes = await fetch(
          `/api/lecturers/supervisees/${studentId}`,
          { credentials: "include" }
        );

        if (!superviseeRes.ok) {
          throw new Error(
            `Failed to load supervisee (HTTP ${superviseeRes.status})`
          );
        }

        const superviseeData = (await superviseeRes.json()) as SuperviseeDetail;
        setSupervisee(superviseeData);

        // Load submissions
        const submissionsRes = await fetch(
          `/api/lecturers/supervisees/${studentId}/submissions`,
          { credentials: "include" }
        );

        if (!submissionsRes.ok) {
          throw new Error(
            `Failed to load submissions (HTTP ${submissionsRes.status})`
          );
        }

        const submissionsData = (await submissionsRes.json()) as Submission[];
        setSubmissions(submissionsData);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      load();
    }
  }, [studentId]);

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("approved")) return "#51cf66";
    if (statusLower.includes("revision")) return "#ffa94d";
    if (statusLower.includes("pending")) return "#74c0fc";
    return "#868e96";
  };

  return (
    <ShellLayout
      me={me}
      title={supervisee?.fullName || "Loading..."}
      subtitle="View supervisee profile and submissions"
      activeNav="dashboard"
    >
      {loading && (
        <div className="card">
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div className="card">
          <p style={{ color: "#d32f2f" }}>{error}</p>
          <button
            onClick={() => navigate("/lecturer/dashboard")}
            style={{
              marginTop: "12px",
              padding: "8px 16px",
              backgroundColor: "#1971c2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {!loading && !error && supervisee && (
        <>
          <div className="card">
            <div className="card-title">Student Information</div>
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                  Full Name
                </label>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
                  {supervisee.fullName}
                </p>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                  Email
                </label>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
                  {supervisee.email}
                </p>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                  Faculty
                </label>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
                  {supervisee.faculty || "N/A"}
                </p>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                  Major
                </label>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
                  {supervisee.major || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <div className="card-title">Thesis Submissions</div>
            <div className="card-subtitle">
              Track all submissions from this student
            </div>

            {submissions.length === 0 ? (
              <p style={{ marginTop: 12, color: "#666" }}>
                No submissions yet.
              </p>
            ) : (
              <div style={{ marginTop: 16 }}>
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
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                        {submission.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Submitted: {submission.submittedDate}
                        {submission.lastUpdated && (
                          <> • Updated: {submission.lastUpdated}</>
                        )}
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
                      }}
                    >
                      {submission.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/lecturer/dashboard")}
            style={{
              marginTop: "24px",
              padding: "8px 16px",
              backgroundColor: "#f0f0f0",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Back to Dashboard
          </button>
        </>
      )}
    </ShellLayout>
  );
}

export default LecturerSuperviseeDetailPage;
