import { useAuth } from "../../../auth/AuthContext";

export default function AcLandPage() {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>AcLand Dashboard</h2>
      <p>Hello, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
