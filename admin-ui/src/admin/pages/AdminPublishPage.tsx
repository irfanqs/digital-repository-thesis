import { useEffect, useState } from "react";
import ShellLayout from "../../layout/ShellLayout";
import type { Me } from "../../lib/types/user";

interface Props {
  me: Me;
}

interface ApprovedThesis {
  thesisId: number;
  studentName: string;
  thesisTitle: string;
  submittedDate: string;
  pdfPath?: string;
}

interface PublishForm {
  thesisId: number;
  title: string;
  authors: string;
  faculty: string;
  major: string;
  yearPublished: string;
  keywords: string;
}

function AdminPublishPage({ me }: Props) {
  const [approvedTheses, setApprovedTheses] = useState<ApprovedThesis[]>([]);
  const [selectedThesis, setSelectedThesis] = useState<ApprovedThesis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PublishForm>({
    thesisId: 0,
    title: "",
    authors: "",
    faculty: "",
    major: "",
    yearPublished: new Date().getFullYear().toString(),
    keywords: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/approved-theses", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to load approved theses (HTTP ${res.status})`);
        }

        const data = (await res.json()) as ApprovedThesis[];
        setApprovedTheses(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? "Failed to load approved theses");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSelectThesis = (thesis: ApprovedThesis) => {
    setSelectedThesis(thesis);
    setFormData({
      thesisId: thesis.thesisId,
      title: thesis.thesisTitle,
      authors: thesis.studentName,
      faculty: "",
      major: "",
      yearPublished: new Date().getFullYear().toString(),
      keywords: "",
    });
    setPublishError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishLoading(true);
    setPublishError(null);

    try {
      const res = await fetch("/api/admin/publish-thesis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Failed to publish thesis (HTTP ${res.status})`);
      }

      // Remove published thesis from list
      setApprovedTheses((prev) =>
        prev.filter((t) => t.thesisId !== formData.thesisId)
      );
      setSelectedThesis(null);
      alert("Thesis published successfully!");
    } catch (e: any) {
      console.error(e);
      setPublishError(e.message ?? "Failed to publish thesis");
    } finally {
      setPublishLoading(false);
    }
  };

  return (
    <ShellLayout
      me={me}
      title="Publish Thesis"
      subtitle="Publish approved theses to the public repository"
      activeNav="submissions"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Left: List of Approved Theses */}
        <div className="card">
          <div className="card-title">Approved Theses</div>
          <div className="card-subtitle">Select a thesis to publish</div>

          {loading && <p style={{ marginTop: 12 }}>Loading approved theses...</p>}
          {error && !loading && (
            <p style={{ marginTop: 12, color: "#d32f2f" }}>{error}</p>
          )}

          {!loading && !error && (
            <div style={{ marginTop: 16 }}>
              {approvedTheses.length === 0 ? (
                <p style={{ color: "#666" }}>No approved theses to publish.</p>
              ) : (
                <div>
                  {approvedTheses.map((thesis) => (
                    <div
                      key={thesis.thesisId}
                      onClick={() => handleSelectThesis(thesis)}
                      style={{
                        padding: "12px",
                        border:
                          selectedThesis?.thesisId === thesis.thesisId
                            ? "2px solid #1971c2"
                            : "1px solid #e9ecef",
                        borderRadius: "6px",
                        marginBottom: "12px",
                        cursor: "pointer",
                        backgroundColor:
                          selectedThesis?.thesisId === thesis.thesisId
                            ? "#e7f5ff"
                            : "transparent",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedThesis?.thesisId !== thesis.thesisId) {
                          (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f8f9fa";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedThesis?.thesisId !== thesis.thesisId) {
                          (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: "4px", fontSize: "14px" }}>
                        {thesis.thesisTitle}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                        {thesis.studentName}
                      </div>
                      <div style={{ fontSize: "12px", color: "#999" }}>
                        Approved: {thesis.submittedDate}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Publish Form */}
        <div className="card">
          <div className="card-title">Publish Details</div>
          <div className="card-subtitle">
            {selectedThesis ? "Enter publication details" : "Select a thesis to start"}
          </div>

          {selectedThesis && (
            <form onSubmit={handlePublish} style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Author(s) *
                </label>
                <input
                  type="text"
                  name="authors"
                  value={formData.authors}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Faculty *
                </label>
                <input
                  type="text"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Major *
                </label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Year Published *
                </label>
                <input
                  type="number"
                  name="yearPublished"
                  value={formData.yearPublished}
                  onChange={handleFormChange}
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Keywords (comma-separated) *
                </label>
                <textarea
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  placeholder="e.g., artificial intelligence, machine learning, neural networks"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {publishError && (
                <p style={{ color: "#d32f2f", marginBottom: 16 }}>{publishError}</p>
              )}

              <button
                type="submit"
                disabled={publishLoading}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  backgroundColor: publishLoading ? "#ccc" : "#51cf66",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: publishLoading ? "not-allowed" : "pointer",
                }}
              >
                {publishLoading ? "Publishing..." : "Publish Thesis"}
              </button>
            </form>
          )}
        </div>
      </div>
    </ShellLayout>
  );
}

export default AdminPublishPage;
