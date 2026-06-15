import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

/* ── password strength ───────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8)              score++;
  if (/[A-Z]/.test(pw))           score++;
  if (/[0-9]/.test(pw))           score++;
  if (/[^A-Za-z0-9]/.test(pw))   score++;
  if (score <= 1) return { label: "Weak",   color: "#f87171", bars: 1 };
  if (score === 2) return { label: "Fair",   color: "#fbbf24", bars: 2 };
  if (score === 3) return { label: "Good",   color: "#34d399", bars: 3 };
  return             { label: "Strong", color: "#4ade80", bars: 4 };
}

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
  orb1: {
    position: "absolute",
    width: "520px",
    height: "520px",
    borderRadius: "50%",
    background: "radial-gradient(circle, #6366f11a 0%, transparent 70%)",
    top: "-140px",
    right: "-100px",
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute",
    width: "380px",
    height: "380px",
    borderRadius: "50%",
    background: "radial-gradient(circle, #4f46e514 0%, transparent 70%)",
    bottom: "-100px",
    left: "-80px",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
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
    flexShrink: 0,
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
    lineHeight: 1.5,
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
  inputError: {
    borderColor: "#f8717166",
    boxShadow: "0 0 0 3px #f8717118",
  },
  inputValid: {
    borderColor: "#4ade8033",
  },
  errorText: {
    fontSize: "11px",
    color: "#f87171",
    marginTop: "5px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  /* password strength bars */
  strengthWrap: {
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  strengthBars: {
    display: "flex",
    gap: "4px",
  },
  strengthBar: (active, color) => ({
    flex: 1,
    height: "3px",
    borderRadius: "99px",
    background: active ? color : "#1e1e28",
    transition: "background 300ms ease",
  }),
  strengthLabel: (color) => ({
    fontSize: "10.5px",
    color: color ?? "#2e2e3e",
    fontWeight: 500,
    transition: "color 300ms ease",
  }),
  /* toast */
  toast: (type) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    background: type === "error" ? "rgba(248,113,113,0.08)" : "rgba(74,222,128,0.08)",
    border: `1px solid ${type === "error" ? "#f8717130" : "#4ade8030"}`,
    borderRadius: "10px",
    padding: "11px 14px",
    marginBottom: "18px",
    fontSize: "13px",
    color: type === "error" ? "#fca5a5" : "#86efac",
    lineHeight: 1.45,
    animation: "fadeSlideIn 220ms ease both",
  }),
  toastIcon: {
    fontSize: "14px",
    flexShrink: 0,
    marginTop: "1px",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    display: "inline-block",
    width: "13px",
    height: "13px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "13px",
    color: "#3a3a52",
  },
  footerLink: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: 500,
    marginLeft: "4px",
    transition: "color 150ms",
  },
};

/* inject keyframes once */
if (typeof document !== "undefined" && !document.getElementById("cs-register-kf")) {
  const style = document.createElement("style");
  style.id = "cs-register-kf";
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

function Register() {
  const navigate = useNavigate();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState(null); // { type: "error"|"success", message }
  const [touched, setTouched]   = useState({});   // track which fields were blurred

  const strength = getStrength(password);

  /* ── field blur tracking ─────────────────────────────── */
  const handleBlur = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  /* ── inline validation ───────────────────────────────── */
  const errors = {
    name:     touched.name     && !name.trim()              ? "Full name is required" : null,
    email:    touched.email    && !/\S+@\S+\.\S+/.test(email) ? "Enter a valid email"  : null,
    password: touched.password && password.length < 6       ? "Min. 6 characters"     : null,
  };

  const inputStyle = (field) => {
    if (errors[field])                          return { ...s.input, ...s.inputError };
    if (touched[field] && !errors[field] && (field === "name" ? name : field === "email" ? email : password))
                                                return { ...s.input, ...s.inputValid };
    return s.input;
  };

  /* ── submit ──────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });

    if (errors.name || errors.email || errors.password) return;
    if (!name.trim() || !email || !password) return;

    setLoading(true);
    setToast(null);

    try {
      await api.post("/auth/register", { name, email, password });
      setToast({ type: "success", message: "Account created! Redirecting to login…" });
      setTimeout(() => navigate("/login"), 1400);
    } catch (error) {
      console.error(error);
      setToast({
        type: "error",
        message: error.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = { borderColor: "#6366f1", boxShadow: "0 0 0 3px #6366f122" };
  const blurStyle  = {};

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

        <h1 style={s.heading}>Create your account</h1>
        <p style={s.sub}>Start collaborating in seconds</p>

        {/* Toast */}
        {toast && (
          <div style={s.toast(toast.type)}>
            <span style={s.toastIcon}>{toast.type === "error" ? "✕" : "✓"}</span>
            <span>{toast.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Full Name</label>
            <input
              type="text"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur("name")}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              style={inputStyle("name")}
              required
              autoComplete="name"
            />
            {errors.name && <div style={s.errorText}>⚠ {errors.name}</div>}
          </div>

          {/* Email */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              style={inputStyle("email")}
              required
              autoComplete="email"
            />
            {errors.email && <div style={s.errorText}>⚠ {errors.email}</div>}
          </div>

          {/* Password */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              style={inputStyle("password")}
              required
              autoComplete="new-password"
            />
            {errors.password && <div style={s.errorText}>⚠ {errors.password}</div>}

            {/* Strength meter */}
            {password && (
              <div style={s.strengthWrap}>
                <div style={s.strengthBars}>
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      style={s.strengthBar(strength && strength.bars >= n, strength?.color)}
                    />
                  ))}
                </div>
                <span style={s.strengthLabel(strength?.color)}>
                  {strength?.label} password
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            style={{ ...s.submitBtn, opacity: loading ? 0.72 : 1 }}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = loading ? "0.72" : "1")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e)   => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading
              ? <><span style={s.spinner} /> Creating account…</>
              : "Create Account →"
            }
          </button>
        </form>

        <div style={s.footer}>
          Already have an account?
          <Link
            to="/login"
            style={s.footerLink}
            onMouseEnter={(e) => (e.target.style.color = "#818cf8")}
            onMouseLeave={(e) => (e.target.style.color = "#6366f1")}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;