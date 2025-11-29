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
      <SupervisorsSection />
    </ShellLayout>
  );
}

export default StudentDashboard;
