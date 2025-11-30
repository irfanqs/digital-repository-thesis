import ShellLayout from "../../layout/ShellLayout";
import type { Me } from "../../lib/types/user";

interface Props {
  me: Me;
}

function StudentSubmitPage({ me }: Props) {
  return (
    <ShellLayout
      me={me}
      title="Submit Thesis"
      subtitle="Upload and submit your thesis for review"
      activeNav="submissions"
    >
      <div className="card">
        <div className="card-title">Thesis Submission</div>
        <div className="card-subtitle">
          Submit your thesis as a PDF and track its review status
        </div>

        <p style={{ marginTop: 12, color: "#666" }}>
          Fitur pengumpulan tesis akan hadir di sini. Sementara ini, pastikan
          supervisor Anda sudah benar dan hubungi admin untuk proses unggah
          jika diperlukan.
        </p>
      </div>
    </ShellLayout>
  );
}

export default StudentSubmitPage;
