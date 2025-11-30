import ShellLayout from "../../layout/ShellLayout";
import type { Me } from "../../lib/types/user";

interface Props {
  me: Me;
}

function StudentAccountPage({ me }: Props) {
  return (
    <ShellLayout
      me={me}
      title="Account Information"
      subtitle="View your personal and academic information"
      activeNav="account"
    >
      <div className="card">
        <div className="card-title">Account Details</div>
        <div className="card-subtitle">
          Your account information (read-only)
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              Full Name
            </label>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
              {me.fullName || "N/A"}
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              Email
            </label>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
              {me.email || "N/A"}
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              Student ID
            </label>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
              {me.studentId || "N/A"}
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              Faculty
            </label>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
              {me.faculty || "N/A"}
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              Major
            </label>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
              {me.major || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </ShellLayout>
  );
}

export default StudentAccountPage;
