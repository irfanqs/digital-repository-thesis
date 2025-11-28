import { FormEvent, useEffect, useState } from "react";
import ShellLayout from "../layout/ShellLayout";

type Role = "STUDENT" | "LECTURER" | "ADMIN";

interface Me {
  id: number;
  email: string;
  role: Role;
}

interface LecturerSummary {
  id: number;
  email: string;
  nidn: string | null;
  department: string | null;
}

interface SupervisorRow {
  lecturerId: number;
  email: string;
  roleMain: boolean;
}

interface Props {
  me: Me;
}

/**
 * Student portal dashboard.
 *
 * For now we focus on:
 *  - viewing current supervisors
 *  - adding a new supervisor from a dropdown list of lecturers
 */
function StudentDashboard({ me }: Props) {
  const [lecturers, setLecturers] = useState<LecturerSummary[]>([]);
  const [supervisors, setSupervisors] = useState<SupervisorRow[]>([]);
  const [loadingLecturers, setLoadingLecturers] = useState(true);
  const [loadingSupervisors, setLoadingSupervisors] = useState(true);

  const [selectedLecturerId, setSelectedLecturerId] = useState<string>("");
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // Load all lecturers for the dropdown
  useEffect(() => {
    const loadLecturers = async () => {
      try {
        const res = await fetch("/api/lecturers/list", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to load lecturers (HTTP ${res.status})`);
        }
        const data = (await res.json()) as LecturerSummary[];
        setLecturers(data);
      } catch (err: any) {
        console.error(err);
        setAddError(err.message ?? "Failed to load lecturers list.");
      } finally {
        setLoadingLecturers(false);
      }
    };

    loadLecturers();
  }, []);

  // Load my current supervisors
  useEffect(() => {
    const loadSupervisors = async () => {
      try {
        const res = await fetch("/api/lecturers/supervisees", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to load supervisors (HTTP ${res.status})`);
        }
        const data = (await res.json()) as SupervisorRow[];
        setSupervisors(data);
      } catch (err: any) {
        console.error(err);
        setAddError(err.message ?? "Failed to load supervisors.");
      } finally {
        setLoadingSupervisors(false);
      }
    };

    loadSupervisors();
  }, []);

  const refreshSupervisors = async () => {
    setLoadingSupervisors(true);
    try {
      const res = await fetch("/api/lecturers/supervisees", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Failed to load supervisors (HTTP ${res.status})`);
      }
      const data = (await res.json()) as SupervisorRow[];
      setSupervisors(data);
    } catch (err: any) {
      console.error(err);
      setAddError(err.message ?? "Failed to refresh supervisors.");
    } finally {
      setLoadingSupervisors(false);
    }
  };

  // Handle "Add supervisor" submit
  const handleAddSupervisor = async (e: FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);

    if (!selectedLecturerId) {
      setAddError("Please select a lecturer to add as supervisor.");
      return;
    }

    const lecturer = lecturers.find(
      (l) => l.id === Number(selectedLecturerId)
    );
    if (!lecturer) {
      setAddError("Selected lecturer not found in list.");
      return;
    }

    try {
      const res = await fetch("/api/lecturers/supervisees", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: lecturer.email }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message =
          body.error ??
          `Failed to add supervisor (HTTP ${res.status})`;
        throw new Error(message);
      }

      setAddSuccess(
        `Lecturer ${lecturer.email} has been added as your supervisor (or was already assigned).`
      );
      // refresh the list so the new supervisor appears immediately
      await refreshSupervisors();
    } catch (err: any) {
      console.error(err);
      setAddError(err.message ?? "Failed to add supervisor.");
    }
  };

  return (
    <ShellLayout
      me={me}
      title="Dashboard"
      subtitle="Student portal – manage your supervisors and thesis submissions."
      activeNav="dashboard"
    >
      {/* Supervisors card */}
      <div className="card">
        <div className="card-title">Supervisors</div>
        <div className="card-subtitle">
          View your current supervisors and add a new one from the lecturer
          list.
        </div>

        {/* Current supervisors table */}
        <div style={{ marginTop: 12 }}>
          <h3 className="section-heading">Current Supervisors</h3>
          {loadingSupervisors ? (
            <p>Loading your supervisors...</p>
          ) : supervisors.length === 0 ? (
            <p>You do not have any supervisors assigned yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Main Supervisor?</th>
                </tr>
              </thead>
              <tbody>
                {supervisors.map((s) => (
                  <tr key={s.lecturerId}>
                    <td>{s.email}</td>
                    <td>{s.roleMain ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add supervisor section */}
        <div style={{ marginTop: 24 }}>
          <h3 className="section-heading">Add Supervisor</h3>
          <p className="hint">
            Choose a lecturer from the list below and click{" "}
            <strong>Add supervisor</strong>. The link is idempotent – if the
            supervisor is already assigned, nothing will be duplicated.
          </p>

          {loadingLecturers ? (
            <p>Loading available lecturers...</p>
          ) : lecturers.length === 0 ? (
            <p>No lecturers are configured in the system yet.</p>
          ) : (
            <form
              onSubmit={handleAddSupervisor}
              style={{ display: "flex", gap: 12, alignItems: "flex-end" }}
            >
              <div className="field-group" style={{ flex: 1 }}>
                <label htmlFor="lecturerSelect">Select lecturer</label>
                <select
                  id="lecturerSelect"
                  value={selectedLecturerId}
                  onChange={(e) => setSelectedLecturerId(e.target.value)}
                >
                  <option value="">-- Choose lecturer --</option>
                  {lecturers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.email}
                      {l.department ? ` • ${l.department}` : ""}
                      {l.nidn ? ` • NIDN ${l.nidn}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                Add supervisor
              </button>
            </form>
          )}

          {/* Messages */}
          {addError && (
            <p className="hint" style={{ color: "var(--danger)" }}>
              {addError}
            </p>
          )}
          {addSuccess && (
            <p className="hint" style={{ color: "var(--success)" }}>
              {addSuccess}
            </p>
          )}
        </div>
      </div>
    </ShellLayout>
  );
}

export default StudentDashboard;
