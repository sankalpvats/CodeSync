import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase.js";
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
  const handleGoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, provider);

        const idToken = await result.user.getIdToken();

        const res = await api.post("/auth/google", {
            token: idToken,
        });

        localStorage.setItem("token", res.data.token);
localStorage.setItem("username", res.data.user.name);
localStorage.setItem("avatar", res.data.user.avatar || "");

navigate("/dashboard");

    } catch (err) {
        console.log(err);
    }
};
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
localStorage.setItem("username", res.data.user.name);
localStorage.setItem("avatar", res.data.user.avatar || "");
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
        <button
  type="button"
  onClick={handleGoogleLogin}
  style={{
    width: "100%",
    marginTop: "14px",
    padding: "11px",
    borderRadius: "10px",
    border: "1px solid #dadce0",
    background: "#fff",
    color: "#3c4043",
    cursor: "pointer",
    fontWeight: "500",
    fontFamily: "'Roboto', 'Inter', system-ui, sans-serif",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  }}
>
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"/>
  </svg>
  Sign in with Google
</button>

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