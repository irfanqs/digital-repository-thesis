import { useEffect, useState } from "react";

interface LecturerThesis {
  thesisId: number;
  studentId: number;
  title: string;
  status: string;
  submittedAt: string | null;
}

function SuperviseeThesesSection() {
  const [theses, setTheses] = useState<LecturerThesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/lecturers/theses", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to load theses (HTTP ${res.status})`);
        }

        const data = (await res.json()) as LecturerThesis[];
        setTheses(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? "Failed to load theses");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="card">
      <div className="card-title">Supervisee Theses</div>
      <div className="card-subtitle">
        View theses submitted by students who have assigned you as their
        supervisor.
      </div>

      {loading && <p>Loading...</p>}
      {error && !loading && <p>{error}</p>}

      {!loading && !error && (
        <>
          {theses.length === 0 ? (
            <p>No supervisee submissions yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {theses.map((t) => (
                  <tr key={t.thesisId}>
                    <td>{t.title}</td>
                    <td>{t.status}</td>
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

      <p className="hint">
        Later we can extend this page so you can open each thesis, leave
        comments, or see more details about the student profile.
      </p>
    </div>
  );
}

export default SuperviseeThesesSection;
