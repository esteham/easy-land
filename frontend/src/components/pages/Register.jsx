import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role:"user" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form);
      // nav("/dashboard");
      nav("/login");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to register");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 360, margin: "2rem auto" }}>
      <h2>Register</h2>
      {err && <p>{err}</p>}
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
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
      <button type="submit">Create account</button>
    </form>
  );
}
