import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div>
          <span className="eyebrow">Laundry and dry-cleaning CRM</span>
          <h1>Sign in to manage customers, orders, payments, and reports.</h1>
        </div>

        <div className="segmented">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">
            Login
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")} type="button">
            Register
          </button>
        </div>

        <form onSubmit={submit} className="form-grid">
          {mode === "register" && (
            <label>
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
          )}
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={6}
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-button" type="submit">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
