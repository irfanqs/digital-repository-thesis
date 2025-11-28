import { useEffect, useState } from "react";
import StudentDashboard from "./student/StudentDashboard";
import LecturerDashboard from "./lecturer/LecturerDashboard";
import AdminDashboard from "./admin/AdminDashboard";

type Role = "STUDENT" | "LECTURER" | "ADMIN";

interface Me {
  id: number;
  email: string;
  role: Role;
}

function App() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.status === 401) {
          setError("UNAUTHENTICATED");
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = (await res.json()) as Me;
        setMe(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load user info");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading) {
    return <div className="page-center">Loading...</div>;
  }

  if (error === "UNAUTHENTICATED") {
    return (
      <div className="page-center">
        <h1>Digital Thesis Repository</h1>
        <p>You are not logged in.</p>
        <p>
          Please log in using the Spring Security login page at{" "}
          <code>/login</code>, then refresh this page.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-center">
        <h1>Something went wrong</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!me) {
    return null;
  }

  if (me.role === "STUDENT") {
    return <StudentDashboard me={me} />;
  }

  if (me.role === "LECTURER") {
    return <LecturerDashboard me={me} />;
  }

  if (me.role === "ADMIN") {
    return <AdminDashboard me={me} />;
  }

  return (
    <div className="page-center">
      <p>Unknown role: {me.role}</p>
    </div>
  );
}

export default App;
