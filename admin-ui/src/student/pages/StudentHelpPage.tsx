import ShellLayout from "../../layout/ShellLayout";
import type { Me } from "../../lib/types/user";

interface Props {
  me: Me;
}

function StudentHelpPage({ me }: Props) {
  return (
    <ShellLayout
      me={me}
      title="Help & Documentation"
      subtitle="Get help and learn how to use the system"
      activeNav="help"
    >
      <div className="card">
        <div className="card-title">Help & Documentation</div>
        <div className="card-subtitle">
          Resources and guidance for students
        </div>

        <p style={{ marginTop: 12, color: "#666" }}>
          Help documentation - Coming soon
        </p>
      </div>
    </ShellLayout>
  );
}

export default StudentHelpPage;
