// src/admin/components/BrowseStudentsSection.tsx
import { useState, useEffect } from "react";

interface Student {
  id: number;
  email: string;
  name: string | null;
  studentNumber: string | null;
  program: string | null;
  faculty: string | null;
}

function BrowseStudentsSection() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, nameFilter, programFilter, facultyFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/students", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = students;

    if (nameFilter.trim()) {
      filtered = filtered.filter((student) =>
        (student.name || "").toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (programFilter.trim()) {
      filtered = filtered.filter((student) =>
        (student.program || "").toLowerCase().includes(programFilter.toLowerCase())
      );
    }

    if (facultyFilter.trim()) {
      filtered = filtered.filter((student) =>
        (student.faculty || "").toLowerCase().includes(facultyFilter.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const clearFilters = () => {
    setNameFilter("");
    setProgramFilter("");
    setFacultyFilter("");
  };

  if (loading) {
    return (
      <section style={{ marginBottom: "2rem" }}>
        <h2>Browse Students</h2>
        <p>Loading students...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ marginBottom: "2rem" }}>
        <h2>Browse Students</h2>
        <p style={{ color: "red" }}>Error: {error}</p>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2>Browse Students</h2>
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        Search and filter students by name, program, or faculty.
      </p>

      {/* Filter Controls */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <div>
          <label
            htmlFor="nameFilter"
            style={{
              display: "block",
              marginBottom: "0.25rem",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            Name
          </label>
          <input
            id="nameFilter"
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Search by name..."
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "0.875rem",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="programFilter"
            style={{
              display: "block",
              marginBottom: "0.25rem",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            Program
          </label>
          <input
            id="programFilter"
            type="text"
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            placeholder="Search by program..."
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "0.875rem",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="facultyFilter"
            style={{
              display: "block",
              marginBottom: "0.25rem",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            Faculty
          </label>
          <input
            id="facultyFilter"
            type="text"
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            placeholder="Search by faculty..."
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "0.875rem",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={clearFilters}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <p style={{ marginBottom: "1rem", fontSize: "0.875rem", color: "#666" }}>
        Showing {filteredStudents.length} of {students.length} student
        {students.length !== 1 ? "s" : ""}
      </p>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <p style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
          No students found matching your filters.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: 600,
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: 600,
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: 600,
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Student Number
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: 600,
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Program
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: 600,
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Faculty
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  style={{
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  <td style={{ padding: "0.75rem" }}>
                    <strong>{student.name || "N/A"}</strong>
                  </td>
                  <td style={{ padding: "0.75rem", color: "#666" }}>
                    {student.email}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    {student.studentNumber || "N/A"}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    {student.program || "N/A"}
                  </td>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
                    {student.faculty || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default BrowseStudentsSection;
