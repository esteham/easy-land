import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(form);
      const u =JSON.parse(localStorage.getItem("user-cache") || "null");
    } catch (e) {
      setErr(e?.response?.data?.message || "Invalid credentials");
    }

    const next = (role) => {
      const map = {
        admin: "/admin",
        acland: "/acland",
        user: "/user",
      };

      return map[role] || "/dashboard";
    };

    const { user } = useAuth();
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 360, margin: "2rem auto" }}>
      <h2>Login</h2>
      {err && <p>{err}</p>}
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Login</button>
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
