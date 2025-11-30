import ShellLayout from "../../layout/ShellLayout";
import ThesisReviewSection from "../components/ThesisReviewSection";
import type { Me } from "../../lib/types/user";

interface Props {
  me: Me;
}

function SubmissionListPage({ me }: Props) {
  return (
    <ShellLayout
      me={me}
      title="Student Submissions"
      subtitle="Review, approve, and publish student thesis submissions."
      activeNav="submissions"
    >
      <ThesisReviewSection />
    </ShellLayout>
  );
}

export default SubmissionListPage;
