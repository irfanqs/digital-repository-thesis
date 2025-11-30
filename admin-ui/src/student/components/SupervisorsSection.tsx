import { FormEvent, useEffect, useState } from "react";

interface LecturerSummary {
  id: number;
  email: string;
  name: string | null;
  department: string | null;
  faculty: string | null;
  major: string | null;
}

interface SupervisorRow {
  lecturerId: number;
  email: string;
  name: string | null;
  department: string | null;
  faculty: string | null;
  major: string | null;
  roleMain: boolean;
}

function SupervisorsSection() {
  const [lecturers, setLecturers] = useState<LecturerSummary[]>([]);
  const [supervisors, setSupervisors] = useState<SupervisorRow[]>([]);
  const [loadingLecturers, setLoadingLecturers] = useState(true);
  const [loadingSupervisors, setLoadingSupervisors] = useState(true);

  const [selectedLecturerId, setSelectedLecturerId] = useState<string>("");
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // Load all lecturers for the dropdown
  useEffect(() => {
    let mounted = true;
    
    const loadLecturers = async () => {
      try {
        const res = await fetch("/api/lecturers/list", {
          credentials: "include",
        });
        
        if (!mounted) return;
        
        if (res.status === 401 || res.status === 403) {
          throw new Error("Session expired. Please login again.");
        }
        if (!res.ok) {
          throw new Error(`Failed to load lecturers (HTTP ${res.status})`);
        }
        
        const data = await res.json();
        
        if (!mounted) return;
        
        // Validate and filter data
        if (Array.isArray(data)) {
          const validData = data
            .filter(l => l && typeof l.id === 'number' && typeof l.email === 'string')
            .map(l => ({
              id: l.id,
              email: l.email,
              name: l.name ?? null,
              department: l.department ?? null,
              faculty: l.faculty ?? null,
              major: l.major ?? null,
            }));
          setLecturers(validData);
        } else {
          console.error("Lecturers data is not an array:", data);
          setLecturers([]);
        }
      } catch (err: any) {
        if (!mounted) return;
        console.error("Error loading lecturers:", err);
        setAddError(err.message ?? "Failed to load lecturers list.");
      } finally {
        if (mounted) {
          setLoadingLecturers(false);
        }
      }
    };

    loadLecturers();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Load my current supervisors
  const loadSupervisors = async () => {
    try {
      const res = await fetch("/api/lecturers/supervisees", {
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        throw new Error("Session expired. Please login again.");
      }
      if (!res.ok) {
        throw new Error(`Failed to load supervisors (HTTP ${res.status})`);
      }
      const data = await res.json();
      
      // Validate and filter data
      if (Array.isArray(data)) {
        const validData = data
          .filter(s => s && typeof s.lecturerId === 'number')
          .map(s => ({
            lecturerId: s.lecturerId,
            email: s.email,
            name: s.name ?? null,
            department: s.department ?? null,
            faculty: s.faculty ?? null,
            major: s.major ?? null,
            roleMain: Boolean(s.roleMain),
          }));
        setSupervisors(validData);
      } else {
        console.error("Supervisors data is not an array:", data);
        setSupervisors([]);
      }
    } catch (err: any) {
      console.error("Error loading supervisors:", err);
      setAddError(err.message ?? "Failed to load supervisors.");
    } finally {
      setLoadingSupervisors(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    loadSupervisors().then(() => {
      if (!mounted) return;
    });
    
    return () => {
      mounted = false;
    };
  }, []);

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

      if (res.status === 401 || res.status === 403) {
        throw new Error("Session expired. Please login again.");
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message =
          body.error ?? `Failed to add supervisor (HTTP ${res.status})`;
        throw new Error(message);
      }

      setAddSuccess(
        `Lecturer ${lecturer.email} has been added as your supervisor (or was already assigned).`
      );
      await loadSupervisors();
    } catch (err: any) {
      console.error(err);
      setAddError(err.message ?? "Failed to add supervisor.");
    }
  };

  return (
    <div className="card">
      <div className="card-title">Supervisors</div>
      <div className="card-subtitle">
        View your current supervisors and add a new one from the lecturer list.
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
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Faculty</th>
                <th>Major</th>
                <th>Main Supervisor?</th>
              </tr>
            </thead>
            <tbody>
              {supervisors.map((s) => (
                <tr key={s.lecturerId}>
                  <td>{s.name || "N/A"}</td>
                  <td>{s.email}</td>
                  <td>{s.department || "N/A"}</td>
                  <td>{s.faculty || "N/A"}</td>
                  <td>{s.major || "N/A"}</td>
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
                {lecturers.map((l) => {
                  const displayName = l.name || l.email || "Unknown";
                  const details = [
                    l.major,
                    l.department,
                    l.faculty
                  ].filter(Boolean).join(" • ");
                  
                  return (
                    <option key={l.id} value={String(l.id)}>
                      {displayName}{details ? ` • ${details}` : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-sm">
              Add supervisor
            </button>
          </form>
        )}

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
  );
}

export default SupervisorsSection;
