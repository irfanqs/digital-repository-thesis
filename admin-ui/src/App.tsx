import { useAuth } from "./lib/context/AuthContext";
import { AppRoutes } from "./routes";

function App() {
  const { user, loading } = useAuth();

  return <AppRoutes user={user} loading={loading} />;
}

export default App;
