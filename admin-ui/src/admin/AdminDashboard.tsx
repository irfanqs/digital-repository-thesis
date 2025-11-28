import { FormEvent, useEffect, useState } from "react";
import ShellLayout from "../layout/ShellLayout";
import AdminThesisChecklist from "../components/AdminThesisChecklist";

type Role = "STUDENT" | "LECTURER" | "ADMIN";

interface Me {
  id: number;
  email: string;
  role: Role;
}

interface ThesisRow {
  id: number;
  title: string;
  currentStatus: string;
  submittedAt: string | null;
}

interface StudentAccount {
  id: number;
  email: string;
  studentNumber: string | null;
  program: string | null;
  role: Role;
}

interface Props {
  me: Me;
}

function AdminDashboard({ me }: Props) {
  // ── Thesis review state ────────────────────────────────────────────────
  const [theses, setTheses] = useState<ThesisRow[]>([]);
  const [loadingTheses, setLoadingTheses] = useState(true);
  const [thesisError, setThesisError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ── Student search state ───────────────────────────────────────────────
  const [studentEmail, setStudentEmail] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [studentResults, setStudentResults] = useState<StudentAccount[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);

  // Load theses list for the left panel
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/theses", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to load theses (HTTP ${res.status})`);
        }
        const data = (await res.json()) as ThesisRow[];
        setTheses(data);
      } catch (err: any) {
        console.error(err);
        setThesisError(err.message ?? "Failed to load theses.");
      } finally {
        setLoadingTheses(false);
      }
    };

    load();
  }, []);

  const handleStudentSearch = async (e: FormEvent) => {
    e.preventDefault();
    setStudentError(null);
    setStudentResults([]);

    const email = studentEmail.trim();
    const sn = studentNumber.trim();

    if (!email && !sn) {
      setStudentError("Please enter an email or student number to search.");
      return;
    }

    const params = new URLSearchParams();
    if (email) params.append("email", email);
    if (sn) params.append("studentNumber", sn);

    try {
      setLoadingStudents(true);
      const res = await fetch(`/api/admin/students?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Failed to search students (HTTP ${res.status})`);
      }
      const data = (await res.json()) as StudentAccount[];
      setStudentResults(data);
      if (data.length === 0) {
        setStudentError("No matching student accounts found.");
      }
    } catch (err: any) {
      console.error(err);
      setStudentError(err.message ?? "Failed to search students.");
    } finally {
      setLoadingStudents(false);
    }
  };

  return (
    <ShellLayout
      me={me}
      title="Dashboard"
      subtitle="Library admin portal – review, approve, and publish theses."
      activeNav="dashboard"
    >
      {/* ── Card: Thesis Review ───────────────────────────────────────── */}
      <div className="card">
        <div className="card-title">Thesis Review</div>
        <div className="card-subtitle">
          Select a thesis from the list to open its checklist and decision
          panel.
        </div>

        <div className="review-grid">
          {/* LEFT: list of theses */}
          <div>
            <div className="review-panel-title">Submissions</div>
            {loadingTheses && <p>Loading...</p>}
            {thesisError && !loadingTheses && <p>{thesisError}</p>}

            {!loadingTheses && !thesisError && (
              <>
                {theses.length === 0 ? (
                  <p>No theses found.</p>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {theses.map((t) => (
                        <tr
                          key={t.id}
                          className={
                            selectedId === t.id ? "row row--selected" : "row"
                          }
                          onClick={() => setSelectedId(t.id)}
                        >
                          <td>{t.title}</td>
                          <td>{t.currentStatus}</td>
                          <td>
                            {t.submittedAt
                              ? new Date(t.submittedAt).toLocaleString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>

          {/* RIGHT: checklist */}
          <div>
            <div className="review-panel-title">Checklist</div>
            {selectedId == null ? (
              <p>Select a thesis from the list to open its checklist.</p>
            ) : (
              <AdminThesisChecklist thesisId={selectedId} />
            )}
          </div>
        </div>
      </div>

      {/* ── Card: Student Accounts lookup ─────────────────────────────── */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title">Student Accounts</div>
        <div className="card-subtitle">
          Quickly check whether a student has an account in the repository.
        </div>

        <form onSubmit={handleStudentSearch} className="search-row">
          <div className="field-group">
            <label htmlFor="studentEmail">Student Email</label>
            <input
              id="studentEmail"
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="student@my.sampoernauniversity.ac.id"
            />
          </div>
          <div className="field-group">
            <label htmlFor="studentNumber">Student Number</label>
            <input
              id="studentNumber"
              type="text"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              placeholder="e.g. 2306275071"
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              paddingBottom: 3,
            }}
          >
            <button type="submit" className="btn btn-primary btn-sm">
              {loadingStudents ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {studentError && (
          <p className="hint" style={{ color: "var(--danger)" }}>
            {studentError}
          </p>
        )}

        {!loadingStudents && studentResults.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Student Number</th>
                  <th>Program</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {studentResults.map((s) => (
                  <tr key={s.id}>
                    <td>{s.email}</td>
                    <td>{s.studentNumber ?? "-"}</td>
                    <td>{s.program ?? "-"}</td>
                    <td>{s.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ShellLayout>
  );
}

export default AdminDashboard;
