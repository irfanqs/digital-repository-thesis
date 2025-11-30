// src/admin/AdminDashboard.tsx
import ShellLayout from "../layout/ShellLayout";
import type { Me } from "../lib/types/user";

interface Props {
  me: Me;
}

function AdminDashboard({ me }: Props) {
  return (
    <ShellLayout
      me={me}
      title="Dashboard"
      subtitle="Library admin portal – review, approve, and publish theses."
      activeNav="dashboard"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ 
          padding: "1.5rem", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginTop: 0, color: "#495057" }}>Welcome</h3>
          <p style={{ color: "#6c757d", marginBottom: 0 }}>
            Use the sidebar to navigate to different sections of the admin portal.
          </p>
        </div>

        <div style={{ 
          padding: "1.5rem", 
          backgroundColor: "#e7f3ff", 
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginTop: 0, color: "#004085" }}>Quick Actions</h3>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#004085" }}>
            <li>View student submissions</li>
            <li>Browse lecturer profiles</li>
            <li>Manage student accounts</li>
          </ul>
        </div>

        <div style={{ 
          padding: "1.5rem", 
          backgroundColor: "#d4edda", 
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginTop: 0, color: "#155724" }}>System Status</h3>
          <p style={{ color: "#155724", marginBottom: 0 }}>
            All systems operational
          </p>
        </div>
      </div>

      <section>
        <h2>Getting Started</h2>
        <p style={{ color: "#6c757d", lineHeight: 1.6 }}>
          As a library administrator, you can:
        </p>
        <ul style={{ color: "#6c757d", lineHeight: 1.8 }}>
          <li><strong>View Student List</strong> - Manage all registered student accounts</li>
          <li><strong>View Lecturer List</strong> - Browse and search lecturer profiles by name, faculty, or major</li>
          <li><strong>View Student Submission</strong> - Review, approve, and publish thesis submissions</li>
          <li><strong>Browse Published Thesis</strong> - View all published theses available to the public</li>
        </ul>
      </section>
    </ShellLayout>
  );
}

export default AdminDashboard;
