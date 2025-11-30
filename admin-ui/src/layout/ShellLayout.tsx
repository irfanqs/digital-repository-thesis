import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/context/AuthContext";

interface MeLike {
  id: number;
  email: string;
  role: string;
}

type NavKey = "dashboard" | "students" | "lecturers" | "submissions" | "account" | "home" | "browse" | "help";

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
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNavClick = (page: NavKey) => {
    // Navigate based on role and page
    const rolePrefix = me.role.toLowerCase();
    
    switch (page) {
      case "dashboard":
        navigate(`/${rolePrefix}/dashboard`);
        break;
      case "students":
        navigate(`/${rolePrefix}/students`);
        break;
      case "lecturers":
        navigate(`/${rolePrefix}/lecturers`);
        break;
      case "submissions":
        navigate(`/${rolePrefix}/submissions`);
        break;
      case "account":
        navigate(`/${rolePrefix}/account`);
        break;
      case "home":
        navigate("/");
        break;
      case "browse":
        navigate("/");
        break;
      case "help":
        navigate(`/${rolePrefix}/help`);
        break;
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Define menu items based on role
  const getMenuItems = () => {
    const role = me.role.toUpperCase();
    
    if (role === "ADMIN") {
      return (
        <>
          <li>
            <button
              className={"nav-item" + (activeNav === "dashboard" ? " active" : "")}
              onClick={() => handleNavClick("dashboard")}
            >
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "students" ? " active" : "")}
              onClick={() => handleNavClick("students")}
            >
              <span>View Student</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "lecturers" ? " active" : "")}
              onClick={() => handleNavClick("lecturers")}
            >
              <span>View Lecturer</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "submissions" ? " active" : "")}
              onClick={() => handleNavClick("submissions")}
            >
              <span>Publish</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "browse" ? " active" : "")}
              onClick={() => handleNavClick("browse")}
            >
              <span>Browse</span>
            </button>
          </li>
        </>
      );
    }
    
    if (role === "LECTURER") {
      return (
        <>
          <li>
            <button
              className={"nav-item" + (activeNav === "dashboard" ? " active" : "")}
              onClick={() => handleNavClick("dashboard")}
            >
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "browse" ? " active" : "")}
              onClick={() => handleNavClick("browse")}
            >
              <span>Browse</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "help" ? " active" : "")}
              onClick={() => handleNavClick("help")}
            >
              <span>Help</span>
            </button>
          </li>
        </>
      );
    }
    
    if (role === "STUDENT") {
      return (
        <>
          <li>
            <button
              className={"nav-item" + (activeNav === "dashboard" ? " active" : "")}
              onClick={() => handleNavClick("dashboard")}
            >
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "account" ? " active" : "")}
              onClick={() => handleNavClick("account")}
            >
              <span>Account</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "submissions" ? " active" : "")}
              onClick={() => handleNavClick("submissions")}
            >
              <span>Submit</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "browse" ? " active" : "")}
              onClick={() => handleNavClick("browse")}
            >
              <span>Browse</span>
            </button>
          </li>
          <li>
            <button
              className={"nav-item" + (activeNav === "help" ? " active" : "")}
              onClick={() => handleNavClick("help")}
            >
              <span>Help</span>
            </button>
          </li>
        </>
      );
    }
    
    // Default menu
    return (
      <>
        <li>
          <button
            className={"nav-item" + (activeNav === "home" ? " active" : "")}
            onClick={() => handleNavClick("home")}
          >
            <span>Home</span>
          </button>
        </li>
      </>
    );
  };

  return (
    <div className="app-shell">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-header">SU ETD Repository</div>
          <div className="sidebar-sub">Electronic Theses &amp; Dissertations</div>
        </div>

        <ul className="nav-list">
          {getMenuItems()}
          
          <li>
            <button
              className="nav-item"
              onClick={handleLogout}
              style={{ color: "#ff6b6b" }}
            >
              <span>Logout</span>
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