import React, { useEffect, useMemo, useState } from "react";

/**
 * AdminThesisChecklist
 * - Renders ALL categories & items as checkboxes (from your list)
 * - Handles conditional pairs:
 *    • Supervisor (1&2) ↔ Supervisor (single)
 *    • Examiner (1&2)   ↔ Examiner (single)
 * - Loads existing ticks from GET /api/admin/theses/:id/checklist
 * - Saves with POST /api/admin/theses/:id/checklist { selections, replace:true }
 * - Allows Approve / Revisions Required with notes
 *
 * Props:
 *   thesisId: number
 */
export default function AdminThesisChecklist({ thesisId }: { thesisId: number }) {
  /** =============== 1) Catalog =============== */
  type Item = { label: string; key: string; category: string; exclusiveGroup?: string };
  type Cat = { name: string; items: Item[] };

  const slug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

  // Helper to build items with keys from category + label
  const build = (category: string, labels: (string | { label: string; exclusiveGroup?: string })[]): Cat => {
    const catSlug = slug(category);
    const items: Item[] = labels.map((it) => {
      const l = typeof it === "string" ? it : it.label;
      const eg = typeof it === "string" ? undefined : it.exclusiveGroup;
      return { label: l, category, key: `${catSlug}__${slug(l)}`, exclusiveGroup: eg };
    });
    return { name: category, items };
  };

  // Conditional groups (mutually exclusive) per your notes:
  const SUP_PAIR = "supervisor_pair";
  const EXM_PAIR = "examiner_pair";

  const CATALOG: Cat[] = useMemo(() => [
    build("Layout", [
      "Margin for all pages",
    ]),

    build("Title Page", [
      "Title",
      "SU logo",
      "UNDERGRADUATE FINAL YEAR PROJECT",
      "Full Name",
      "Student ID Number",
      "Study Program",
      "Faculty",
      "Sampoerna University",
      "Jakarta",
      "Submission Year",
    ]),

    build("Supervisor Approval Page", [
      "Title",
      "SU logo",
      "UNDERGRADUATE FINAL YEAR PROJECT",
      "Full Name",
      "Student ID Number",
      { label: "Supervisor 1: Supervisor 2:", exclusiveGroup: SUP_PAIR },
      { label: "Supervisor:", exclusiveGroup: SUP_PAIR },
      "Supervisor Name with Title",
      "Date",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Examiner Board Approval Page", [
      "EXAMINER BOARD APPROVAL",
      "Watermark",
      "Name of Student",
      "Student ID Number",
      "Study Program",
      "Faculty",
      "Final Year Project Title",
      "Bachelor of (title degree)",
      "in (Study Program)",
      "Faculty of (Name of Faculty)",
      "Date of Thesis Defense",
      "Board of Examiners",
      { label: "Examiner 1: Examiner 2:", exclusiveGroup: EXM_PAIR },
      { label: "Examiner:", exclusiveGroup: EXM_PAIR },
      "Examiner Name with Title",
      { label: "Supervisor 1: Supervisor 2:", exclusiveGroup: SUP_PAIR },
      { label: "Supervisor:", exclusiveGroup: SUP_PAIR },
      "Supervisor Name with Title",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Declaration of Originality Page", [
      "DECLARATION OF ORIGINALITY",
      "Watermark",
      "Name of Student",
      "Student ID",
      "Title",
      "Place, Date",
      "Physical stamp duty 10,000",
      "Author's signature",
      "Full Name",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Exclusive Right Statement Page", [
      "EXCLUSIVE RIGHT STATEMENT",
      "Watermark",
      "Name",
      "Student ID Number",
      "Study Program",
      "Faculty",
      "Type of Work",
      "Academic work entitled",
      "Place, Date",
      "Author's signature",
      "Full Name",
      "Remove Note in *",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Acknowledgement Page", [
      "ACKNOWLEDGEMENT",
      "Watermark",
      "Content",
      "Place, Date",
      "Author's signature",
      "Full Name",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Abstract Page", [
      "ABSTRACT",
      "Watermark",
      "Full Name",
      "Study Program",
      "Title",
      "Supervisor",
      "Abstract content",
      "Keywords",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Table of Contents Page", [
      "Tips",
      "TABLE OF CONTENTS",
      "Watermark",
      "Content",
      "Page number",
      "Format",
      "Remove",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("List of Figures Page", [
      "LIST OF FIGURES",
      "Content",
      "Watermark",
      "Format",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("List of Tables Page", [
      "LIST OF TABLES",
      "Content",
      "Watermark",
      "Format",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("List of Formulas Page", [
      "LIST OF FORMULAS",
      "Watermark",
      "Format",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("List of Abbreviation Page", [
      "LIST OF ABBREVIATIONS",
      "Watermark",
      "Format",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Chapter I Pages", [
      "CHAPTER I",
      "INTRODUCTION",
      "Watermark",
      "Sub Chapter",
      "Paragraph",
      "Figure*",
      "Figure title*",
      "Table*",
      "Table title*",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Chapter II Pages", [
      "CHAPTER II",
      "LITERATURE REVIEW",
      "Watermark",
      "Sub Chapter",
      "Paragraph",
      "Figure*",
      "Figure title*",
      "Table*",
      "Table title*",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Chapter III Pages", [
      "CHAPTER III",
      "RESEARCH METHODOLOGY",
      "Watermark",
      "Sub Chapter",
      "Paragraph",
      "Figure*",
      "Figure title*",
      "Table*",
      "Table title*",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Chapter IV Pages", [
      "CHAPTER IV",
      "RESULT AND DISCUSSION",
      "Watermark",
      "Sub Chapter",
      "Paragraph",
      "Figure*",
      "Figure title*",
      "Table*",
      "Table title*",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Chapter V Pages", [
      "CHAPTER V",
      "CONCLUSION",
      "Watermark",
      "Sub Chapter",
      "Paragraph",
      "Figure*",
      "Figure title*",
      "Table*",
      "Table title*",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("References Pages", [
      "REFERENCES",
      "References list",
      "Watermark",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Appendix Pages", [
      "APPENDIX",
      "Content",
      "Watermark",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Biography Author Page", [
      "BIOGRAPHY AUTHOR",
      "Author's photo",
      "Content",
      "Watermark",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Index Page", [
      "INDEX",
      "Index list",
      "Watermark",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Glossary Page", [
      "GLOSSARY",
      "Glossary list",
      "Watermark",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),

    build("Symbols Page", [
      "SYMBOLS",
      "Symbols list",
      "Watermark",
      "Page Number",
      "Sampoerna University",
      "Identification Footer",
    ]),
  ], []);

  /** =============== 2) State =============== */
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  // Build a lookup from item.key -> exclusiveGroup (for toggle logic)
  const exclusiveOf: Record<string, string | undefined> = useMemo(() => {
    const map: Record<string, string> = {};
    for (const cat of CATALOG) {
      for (const it of cat.items) {
        if (it.exclusiveGroup) map[it.key] = it.exclusiveGroup;
      }
    }
    return map;
  }, [CATALOG]);

  // Toggle handler with mutual exclusivity
  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const group = exclusiveOf[key];
      if (group && next[key]) {
        // turn off other keys in the same exclusiveGroup
        for (const cat of CATALOG) {
          for (const it of cat.items) {
            if (it.exclusiveGroup === group && it.key !== key) {
              next[it.key] = false;
            }
          }
        }
      }
      return next;
    });
  };

  /** =============== 3) Load ticks =============== */
  useEffect(() => {
    if (!thesisId) return;
    let isAlive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/theses/${thesisId}/checklist`, { credentials: "include" });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!isAlive) return;
        const m: Record<string, boolean> = {};
        (data.checked || []).forEach((k: string) => (m[k] = true));
        setChecked(m);
      } catch (e) {
        console.error(e);
        // it's OK if nothing yet checked
      } finally {
        if (isAlive) setLoading(false);
      }
    })();
    return () => { isAlive = false; };
  }, [thesisId]);

  /** =============== 4) Save ticks =============== */
  const onSave = async () => {
    try {
      setSaving(true);
      // Prepare selections (so backend can auto-create missing items)
      const selections: { key: string; label: string; category: string }[] = [];
      for (const cat of CATALOG) {
        for (const it of cat.items) {
          if (checked[it.key]) {
            selections.push({ key: it.key, label: it.label, category: it.category });
          }
        }
      }
      const res = await fetch(`/api/admin/theses/${thesisId}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ selections, replace: true }),
      });
      if (!res.ok) throw new Error(await res.text());
      alert("Checklist saved.");
    } catch (e: any) {
      alert(e?.message || "Failed to save checklist");
    } finally {
      setSaving(false);
    }
  };

  /** =============== 5) Decision (approve / revisions) =============== */
  const decide = async (status: "APPROVE" | "REVISIONS_REQUIRED") => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/theses/${thesisId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error(await res.text());
      alert(status === "APPROVE" ? "Submission approved." : "Revisions requested.");
    } catch (e: any) {
      alert(e?.message || "Failed to submit decision");
    } finally {
      setSaving(false);
    }
  };

  /** =============== 6) Render =============== */
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h2>Library Review Checklist</h2>
      <p style={{ marginTop: 4 }}>
        {thesisId ? <>Thesis ID: <b>{thesisId}</b></> : <i>Tip: add <code>?id=123</code> to the URL</i>}
      </p>

      {loading ? <div>Loading checklist…</div> : (
        <>
          {CATALOG.map((cat) => (
            <div key={cat.name} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <h3 style={{ marginTop: 0 }}>{cat.name}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {cat.items.map((it) => {
                  const disabledBecauseExclusive =
                    !!it.exclusiveGroup &&
                    Object.entries(checked).some(([k, v]) => v && k !== it.key && exclusiveOf[k] === it.exclusiveGroup);
                  return (
                    <label key={it.key} style={{ display: "flex", alignItems: "center", gap: 8, opacity: disabledBecauseExclusive ? 0.6 : 1 }}>
                      <input
                        type="checkbox"
                        checked={!!checked[it.key]}
                        onChange={() => toggle(it.key)}
                        disabled={!thesisId || (disabledBecauseExclusive && !checked[it.key])}
                      />
                      {it.label}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <button onClick={onSave} disabled={saving || !thesisId} style={{ marginRight: 8 }}>Save Checklist</button>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>Comments / Feedback for Student</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              style={{ width: "100%" }}
              placeholder="Write feedback or reasons for approval/revisions…"
              disabled={!thesisId}
            />
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={() => decide("REVISIONS_REQUIRED")} disabled={saving || !thesisId}>Revisions Required</button>
            <button onClick={() => decide("APPROVE")} disabled={saving || !thesisId}>Approve</button>
          </div>
        </>
      )}
    </div>
  );
}
