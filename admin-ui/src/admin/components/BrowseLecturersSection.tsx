// src/admin/components/BrowseLecturersSection.tsx
import { useState, useEffect } from "react";

interface Lecturer {
  id: number;
  email: string;
  name: string;
  department: string;
  faculty: string;
  major: string;
}

function BrowseLecturersSection() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [filteredLecturers, setFilteredLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");
  const [majorFilter, setMajorFilter] = useState("");

  useEffect(() => {
    fetchLecturers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [lecturers, nameFilter, facultyFilter, majorFilter]);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/lecturers", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch lecturers");
      const data = await res.json();
      setLecturers(data);
      setFilteredLecturers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = lecturers;

    if (nameFilter.trim()) {
      filtered = filtered.filter((lec) =>
        (lec.name || "").toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (facultyFilter.trim()) {
      filtered = filtered.filter((lec) =>
        (lec.faculty || "").toLowerCase().includes(facultyFilter.toLowerCase())
      );
    }

    if (majorFilter.trim()) {
      filtered = filtered.filter((lec) =>
        (lec.major || "").toLowerCase().includes(majorFilter.toLowerCase())
      );
    }

    setFilteredLecturers(filtered);
  };

  const clearFilters = () => {
    setNameFilter("");
    setFacultyFilter("");
    setMajorFilter("");
  };

  if (loading) {
    return (
      <section style={{ marginBottom: "2rem" }}>
        <h2>Browse Lecturers</h2>
        <p>Loading lecturers...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ marginBottom: "2rem" }}>
        <h2>Browse Lecturers</h2>
        <p style={{ color: "red" }}>Error: {error}</p>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2>Browse Lecturers</h2>
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        Search and filter lecturers by name, faculty, or major.
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

        <div>
          <label
            htmlFor="majorFilter"
            style={{
              display: "block",
              marginBottom: "0.25rem",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            Major
          </label>
          <input
            id="majorFilter"
            type="text"
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            placeholder="Search by major..."
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
        Showing {filteredLecturers.length} of {lecturers.length} lecturer
        {lecturers.length !== 1 ? "s" : ""}
      </p>

      {/* Lecturers Table */}
      {filteredLecturers.length === 0 ? (
        <p style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
          No lecturers found matching your filters.
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
                  Department
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
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: 600,
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Major
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLecturers.map((lec) => (
                <tr
                  key={lec.id}
                  style={{
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  <td style={{ padding: "0.75rem" }}>
                    <strong>{lec.name}</strong>
                  </td>
                  <td style={{ padding: "0.75rem", color: "#666" }}>
                    {lec.email}
                  </td>
                  <td style={{ padding: "0.75rem" }}>{lec.department}</td>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
                    {lec.faculty}
                  </td>
                  <td style={{ padding: "0.75rem" }}>{lec.major}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default BrowseLecturersSection;
