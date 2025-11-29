import { useEffect, useState } from "react";
import AdminThesisChecklist from "../../components/AdminThesisChecklist";

interface ThesisRow {
  id: number;
  title: string;
  currentStatus: string;
  submittedAt: string | null;
}

function ThesisReviewSection() {
  const [theses, setTheses] = useState<ThesisRow[]>([]);
  const [loadingTheses, setLoadingTheses] = useState(true);
  const [thesisError, setThesisError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  return (
    <div className="card">
      <div className="card-title">Thesis Review</div>
      <div className="card-subtitle">
        Select a thesis from the list to open its checklist and decision panel.
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
  );
}

export default ThesisReviewSection;
