import ShellLayout from "../../layout/ShellLayout";
import type { Me } from "../../lib/types/user";

interface Props {
  me: Me;
}

function LecturerBrowsePage({ me }: Props) {
  return (
    <ShellLayout
      me={me}
      title="Browse Published Theses"
      subtitle="Search and explore published theses from the repository"
      activeNav="browse"
    >
      <div className="card">
        <div className="card-title">Published Theses Repository</div>
        <div className="card-subtitle">
          Browse and search theses published in the repository
        </div>

        <p style={{ marginTop: 12, color: "#666" }}>
          Browse repository - Coming soon
        </p>
      </div>
    </ShellLayout>
  );
}

export default LecturerBrowsePage;
