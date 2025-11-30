import ShellLayout from "../../layout/ShellLayout";
import BrowseLecturersSection from "../components/BrowseLecturersSection";
import type { Me } from "../../lib/types/user";

interface Props {
  me: Me;
}

function LecturerListPage({ me }: Props) {
  return (
    <ShellLayout
      me={me}
      title="Lecturer List"
      subtitle="Browse and search all lecturers by name, faculty, or major."
      activeNav="lecturers"
    >
      <BrowseLecturersSection />
    </ShellLayout>
  );
}

export default LecturerListPage;
