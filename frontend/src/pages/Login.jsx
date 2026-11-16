import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import logo from '../assets/Stylized Checklist Icon with Pencil.jpeg'

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        username: username.trim(),
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <img src={logo} className="logo"/>
        <h1>Log in  your account</h1>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button className="primary-button" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;