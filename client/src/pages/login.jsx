import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Link } from "react-router-dom";
const s = {
  root: {
    minHeight: "100vh",
    background: "#0d0d0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  },
  /* ambient glow orbs */
  orb1: {
    position: "absolute",
    width: "480px",
    height: "480px",
    borderRadius: "50%",
    background: "radial-gradient(circle, #6366f122 0%, transparent 70%)",
    top: "-120px",
    left: "-120px",
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background: "radial-gradient(circle, #4f46e518 0%, transparent 70%)",
    bottom: "-80px",
    right: "-80px",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    background: "rgba(17, 17, 20, 0.72)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "20px",
    padding: "40px 36px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "28px",
  },
  logoMark: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: 800,
    color: "#fff",
    boxShadow: "0 4px 12px #6366f144",
  },
  logoText: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.3px",
  },
  heading: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.5px",
    marginBottom: "6px",
  },
  sub: {
    fontSize: "13px",
    color: "#4a4a5e",
    marginBottom: "28px",
  },
  fieldWrap: {
    marginBottom: "14px",
  },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "#3a3a52",
    marginBottom: "7px",
  },
  input: {
    width: "100%",
    background: "rgba(13, 13, 16, 0.8)",
    border: "1px solid #1e1e28",
    borderRadius: "10px",
    color: "#e2e2e5",
    fontSize: "13.5px",
    padding: "11px 14px",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 180ms ease, box-shadow 180ms ease",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    marginTop: "24px",
    padding: "13px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "-0.1px",
    fontFamily: "inherit",
    boxShadow: "0 4px 20px #6366f133",
    transition: "opacity 120ms, transform 100ms",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "12px",
    color: "#2e2e3e",
  },
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username",res.data.user.name);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const focusStyle  = { borderColor: "#6366f1", boxShadow: "0 0 0 3px #6366f122" };
  const blurStyle   = { borderColor: "#1e1e28", boxShadow: "none" };

  return (
    <div style={s.root}>
      <div style={s.orb1} />
      <div style={s.orb2} />

      <div style={s.card}>
        {/* Logo */}
        <div style={s.logo}>
          <div style={s.logoMark}>C</div>
          <span style={s.logoText}>CodeSpace</span>
        </div>

        <h1 style={s.heading}>Welcome back</h1>
        <p style={s.sub}>Sign in to your workspace</p>

        <form onSubmit={handleLogin}>
          <div style={s.fieldWrap}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
              style={s.input}
              required
            />
          </div>

          <div style={s.fieldWrap}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
              style={s.input}
              required
            />
          </div>

          <button
            type="submit"
            style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.target.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.target.style.opacity = loading ? "0.7" : "1")}
            onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
            onMouseUp={(e)   => (e.target.style.transform = "scale(1)")}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>
        <div
  style={{
    marginTop: "16px",
    textAlign: "center",
    fontSize: "13px",
    color: "#6b6b80",
  }}
>
  Don't have an account?{" "}
  <Link
    to="/register"
    style={{
      color: "#6366f1",
      textDecoration: "none",
      fontWeight: 600,
    }}
  >
    Sign Up
  </Link>
</div>
        <div style={s.footer}>
          Secure · End-to-end encrypted
        </div>
      </div>
    </div>
  );
}

export default Login;