// src/admin/AdminDashboard.tsx
import ShellLayout from "../layout/ShellLayout";
import ThesisReviewSection from "./components/ThesisReviewSection";
import StudentAccountsSection from "./components/StudentAccountsSection";
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
      <ThesisReviewSection />
      <StudentAccountsSection />
    </ShellLayout>
  );
}

export default AdminDashboard;
