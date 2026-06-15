import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const s = {
  root: {
    minHeight: "100vh",
    background: "#0d0d0f",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
    color: "#e2e2e5",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#111114",
    border: "1px solid #1e1e28",
    borderRadius: "16px",
    padding: "36px",
    boxShadow: "0 24px 80px #00000066",
  },
  header: {
    marginBottom: "32px",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  logo: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.4px",
  },
  logoutBtn: {
    background: "none",
    border: "1px solid #2a2a36",
    borderRadius: "6px",
    color: "#6b6b80",
    fontSize: "12px",
    padding: "4px 12px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "color 0.15s, border-color 0.15s",
  },
  greeting: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.5px",
    marginBottom: "6px",
  },
  sub: {
    fontSize: "13px",
    color: "#4a4a5e",
    lineHeight: 1.5,
  },
  section: {
    marginBottom: "12px",
  },
  sectionLabel: {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#3a3a4e",
    marginBottom: "10px",
  },
  createBtn: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "-0.2px",
    boxShadow: "0 4px 20px #6366f133",
    transition: "opacity 0.15s, transform 0.1s",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "20px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#1e1e28",
  },
  dividerText: {
    fontSize: "11px",
    color: "#2e2e3e",
    flexShrink: 0,
  },
  joinRow: {
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    background: "#0d0d10",
    border: "1px solid #1e1e28",
    borderRadius: "8px",
    color: "#c9c9d8",
    fontSize: "13px",
    padding: "10px 14px",
    outline: "none",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    transition: "border-color 0.15s",
  },
  joinBtn: {
    background: "#1a1a24",
    border: "1px solid #2a2a38",
    borderRadius: "8px",
    color: "#c9c9d8",
    fontSize: "13px",
    fontWeight: 600,
    padding: "10px 18px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.15s, border-color 0.15s",
    whiteSpace: "nowrap",
  },
};

function Dashboard() {
  const [roomId, setRoomId] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const createRoom = async () => {
    setCreating(true);
    try {
      const res = await api.post("/rooms/create", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/room/${res.data.room.roomId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={s.root}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.logoRow}>
            <span style={s.logo}>CodeSpace</span>
            <button
              style={s.logoutBtn}
              onClick={handleLogout}
              onMouseEnter={e => { e.target.style.color = "#e2e2e5"; e.target.style.borderColor = "#3a3a4e"; }}
              onMouseLeave={e => { e.target.style.color = "#6b6b80"; e.target.style.borderColor = "#2a2a36"; }}
            >
              Log out
            </button>
          </div>
          <div style={s.greeting}>Start coding together</div>
          <div style={s.sub}>Create a new room or join an existing session with a room ID.</div>
        </div>

        {/* Create */}
        <div style={s.section}>
          <div style={s.sectionLabel}>New session</div>
          <button
            style={{ ...s.createBtn, opacity: creating ? 0.7 : 1 }}
            onClick={createRoom}
            disabled={creating}
            onMouseEnter={e => !creating && (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = creating ? "0.7" : "1")}
          >
            <span style={{ fontSize: "15px" }}>+</span>
            {creating ? "Creating…" : "Create Room"}
          </button>
        </div>

        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>or join existing</span>
          <div style={s.dividerLine} />
        </div>

        {/* Join */}
        <div style={s.section}>
          <div style={s.sectionLabel}>Join session</div>
          <div style={s.joinRow}>
            <input
              style={s.input}
              placeholder="Enter room ID…"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && roomId && navigate(`/room/${roomId}`)}
              onFocus={e => (e.target.style.borderColor = "#6366f1")}
              onBlur={e => (e.target.style.borderColor = "#1e1e28")}
            />
            <button
              style={s.joinBtn}
              onClick={() => roomId && navigate(`/room/${roomId}`)}
              onMouseEnter={e => { e.target.style.background = "#22222e"; e.target.style.borderColor = "#3a3a4e"; }}
              onMouseLeave={e => { e.target.style.background = "#1a1a24"; e.target.style.borderColor = "#2a2a38"; }}
            >
              Join →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;