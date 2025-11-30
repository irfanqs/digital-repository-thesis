import ShellLayout from "../../layout/ShellLayout";
import BrowseStudentsSection from "../components/BrowseStudentsSection";
import type { Me } from "../../lib/types/user";

interface Props {
  me: Me;
}

function StudentListPage({ me }: Props) {
  return (
    <ShellLayout
      me={me}
      title="Student List"
      subtitle="View and manage all student accounts in the system."
      activeNav="students"
    >
      <BrowseStudentsSection />
    </ShellLayout>
  );
}

export default StudentListPage;
