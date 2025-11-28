import { ReactNode } from "react";

interface MeLike {
  id: number;
  email: string;
  role: string;
}

type NavKey = "dashboard" | "account" | "home" | "browse" | "help";

interface ShellLayoutProps {
  me: MeLike;
  title: string;
  subtitle: string;
  activeNav: NavKey;
  children: ReactNode;
}

function ShellLayout({
  me,
  title,
  subtitle,
  activeNav,
  children,
}: ShellLayoutProps) {
  return (
    <div className="app-shell">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-header">SU ETD Repository</div>
          <div className="sidebar-sub">Electronic Theses &amp; Dissertations</div>
        </div>

        <ul className="nav-list">
          <li>
            <button
              className={
                "nav-item" + (activeNav === "dashboard" ? " active" : "")
              }
            >
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={
                "nav-item" + (activeNav === "account" ? " active" : "")
              }
            >
              <span>Account</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "home" ? " active" : "")}
            >
              <span>Home</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "browse" ? " active" : "")}
            >
              <span>Browse</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "help" ? " active" : "")}
            >
              <span>Help</span>
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div>© Sampoerna University</div>
          <div>ETD Prototype</div>
        </div>
      </aside>

      {/* MAIN PAGE AREA */}
      <main className="page-shell">
        <div className="page-header">
          <div>
            <div className="page-title">{title}</div>
            <div className="page-subtitle">{subtitle}</div>
          </div>
          <div className="account-status">
            Signed in as <strong>{me.email}</strong>
            <br />
            <span style={{ fontSize: "11px" }}>Role: {me.role}</span>
          </div>
        </div>

        <section className="page-section active">{children}</section>
      </main>
    </div>
  );
}

export default ShellLayout;
