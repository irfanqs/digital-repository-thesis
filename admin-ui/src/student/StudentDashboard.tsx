import ShellLayout from "../layout/ShellLayout";
import SupervisorsSection from "./components/SupervisorsSection";
import type { Me } from "../lib/types/user";

interface Props {
  me: Me;
}

function StudentDashboard({ me }: Props) {
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
          <div className="card-title">Thesis Submission</div>
          <div className="card-subtitle">
            Submit your thesis as a PDF and track its review status.
          </div>
          <p style={{ marginTop: 12 }}>
            Fitur pengumpulan tesis akan hadir di sini. Sementara ini, pastikan
            supervisor Anda sudah benar dan hubungi admin untuk proses unggah
            jika diperlukan.
          </p>
        </div>
      </div>
    </ShellLayout>
  );
}

export default StudentDashboard;
