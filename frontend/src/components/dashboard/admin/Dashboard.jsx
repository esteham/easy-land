import { useEffect, useState } from "react";
import api from "../../../api";
import { useAuth } from "../../../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api.get("/dashboard").then(({ data }) => setStats(data.stats));
  }, []);

  return (
    <>
      <div style={{ maxWidth: 600, margin: "2rem auto" }}>
        <h2>Hello, {user?.name}</h2>
        <p>Your sample stats: {JSON.stringify(stats)}</p>
        <button onClick={logout}>Logout</button>
      </div>
      <div style={{ margin: "1rem 0" }}>
        <Link to="/admin/divisions" className="text-indigo-600 underline">
          Manage Divisions
        </Link>
      </div>
      <div style={{ margin: "1rem 0" }}>
        <Link to="/admin/districts" className="text-indigo-600 underline">
          Manage Districts
        </Link>
      </div>
      <div style={{ margin: "1rem 0" }}>
        <Link to="/admin/districts" className="text-indigo-600 underline">
          Manage Upazilas
        </Link>
      </div>
    </>
  );
}
