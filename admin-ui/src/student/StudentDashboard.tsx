import ShellLayout from "../layout/ShellLayout";
import SupervisorsSection from "./components/SupervisorsSection";
import type { Me } from "../lib/types/user";

interface Props {
  me: Me;
}

function StudentDashboard({ me }: Props) {
  // Mock submission data
  const submissions = [
    {
      id: 1,
      title: "Submission 1",
      status: "Approved",
      submittedDate: "2025-01-15",
      statusColor: "#51cf66",
    },
    {
      id: 2,
      title: "Submission 2",
      status: "Need Revision",
      submittedDate: "2025-01-20",
      statusColor: "#ffa94d",
    },
  ];

  return (
    <ShellLayout
      me={me}
      title="Dashboard"
      subtitle="Student portal – manage your supervisors and thesis submissions."
      activeNav="dashboard"
    >
      <div id="supervisors">
        <SupervisorsSection />
      </div>

      <div id="submission" style={{ marginTop: 24 }}>
        <div className="card">
          <div className="card-title">Thesis Submissions</div>
          <div className="card-subtitle">
            Track your thesis submissions and their review status
          </div>

          <div style={{ marginTop: 16 }}>
            {submissions.length > 0 ? (
              <div>
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
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
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        backgroundColor: submission.statusColor,
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
            ) : (
              <p style={{ color: "#666", margin: 0 }}>
                No submissions yet. Go to the Submit page to upload your thesis.
              </p>
            )}
          </div>
        </div>
      </div>
    </ShellLayout>
  );
}

export default StudentDashboard;
