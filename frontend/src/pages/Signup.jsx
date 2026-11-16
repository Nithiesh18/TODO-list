import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import logo from '../assets/Stylized Checklist Icon with Pencil.jpeg'

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = form.username.trim();

    if (!username || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        username,
        password: form.password,
      });

      navigate("/login", {
        state: { message: "Account created! Please log in." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <img src={logo} className="logo" />

        <h1>Create your account</h1>

        {error && <div className="error-message">{error}</div>}

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Choose a username"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          maxLength={30}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Enter password again"
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <button className="primary-button" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}

export default Signup;