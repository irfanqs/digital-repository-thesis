import ShellLayout from "../layout/ShellLayout";
import SuperviseeThesesSection from "./components/SuperviseeThesesSection";
import type { Me } from "../lib/types/user";

interface Props {
  me: Me;
}

function LecturerDashboard({ me }: Props) {
  return (
    <ShellLayout
      me={me}
      title="Dashboard"
      subtitle="Lecturer portal – review theses from your supervisees."
      activeNav="dashboard"
    >
      <SuperviseeThesesSection />
    </ShellLayout>
  );
}

export default LecturerDashboard;
