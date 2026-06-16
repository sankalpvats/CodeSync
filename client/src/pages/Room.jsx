import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../api/axios";
import Editor from "@monaco-editor/react";
import "../styles/Room.css";

const socket = io(import.meta.env.VITE_SOCKET_URL);
console.log("Socket URL:", import.meta.env.VITE_SOCKET_URL);
const AVATAR_COLORS = [
  "#6366f1", "#ec4899", "#f59e0b",
  "#10b981", "#3b82f6", "#8b5cf6",
];

const PANELS = ["input", "output"];

function Room() {
  const { roomId } = useParams();
  const [output, setOutput]           = useState("");
  const [input, setInput]             = useState("");
  const [code, setCode]               = useState("");
  const [users, setUsers]             = useState([]);
  const [language, setLanguage]       = useState("javascript");
  const [running, setRunning]         = useState(false);
  const [activePanel, setActivePanel] = useState("output");
  const [copied, setCopied]           = useState(false);
  const saveTimeoutRef = useRef(null);

  const currentUsername = localStorage.getItem("username");

  /* ── socket / data bootstrap ─────────────────────────── */
  useEffect(() => {
    const loadRoom = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCode(res.data.code || "");
      } catch (error) {
        console.error(error);
      }
    };

    loadRoom();
    console.log("Joining room:", roomId);
    const username = localStorage.getItem("username");
    socket.emit("join-room", { roomId, username });
    socket.on("receive-output", (newOutput) => {setOutput(newOutput);});
    socket.on("receive-input",    (newInput)    => setInput(newInput));
    socket.on("receive-language", (newLanguage) => setLanguage(newLanguage));
    socket.on("receive-code",     (newCode)     => setCode(newCode));
    socket.on("room-users",       (users)       => {
      console.log("Received users:", users);
      setUsers(users);
    });

    return () => {
      socket.off("receive-code");
      socket.off("room-users");
      socket.off("receive-language");
      socket.off("receive-input");
      socket.off("receive-output");
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [roomId]);

  /* ── save code (debounced 1s) ─────────────────────────── */
  const saveCode = async (newCode) => {
    try {
      console.log("Saving to MongoDB...");
      const token = localStorage.getItem("token");
      await api.put(
        `/rooms/${roomId}/code`,
        { code: newCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ── run code ─────────────────────────────────────────── */
  const runCode = async () => {
    setRunning(true);
    setActivePanel("output");
    try {
      const res = await api.post("/code/run", { code, input, language });
      setOutput(res.data.output);
      socket.emit("output-change", {
  roomId,
  output: res.data.output,
});
    } catch (error) {
      console.error(error);
      setOutput("Execution Failed");
    } finally {
      setRunning(false);
    }
  };

  /* ── copy room link ───────────────────────────────────── */
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  /* ── language change ──────────────────────────────────── */
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("language-change", { roomId, language: newLanguage });
  };

  /* ── code change ──────────────────────────────────────── */
  const handleCodeChange = (value) => {
    const newCode = value || "";
    setCode(newCode);
    socket.emit("code-change", { roomId, code: newCode });
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveCode(newCode), 1000);
  };

  /* ── input change ─────────────────────────────────────── */
  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setInput(newInput);
    socket.emit("input-change", { roomId, input: newInput });
  };

  const LANG_EXT = { javascript: "js", python: "py", cpp: "cpp", java: "java" };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: "#0d0d0f", color: "#e2e2e5",
      fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif",
      overflow: "hidden",
    }}>

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="cs-navbar">

        <div className="cs-nav-left">
          <div className="cs-logo">
            <div className="cs-logo-mark">C</div>
            <span className="cs-logo-text">CodeSpace</span>
          </div>
          <div className="cs-nav-sep" />
        </div>

        {/* Center: Room ID badge with copy */}
        <div className="cs-nav-center">
          <button className="cs-room-id" onClick={handleCopyLink} title="Copy room link">
            <span className="cs-room-pip" />
            <span className="cs-room-id-label">Room</span>
            <span className="cs-room-id-value">{roomId}</span>
            <span className="cs-copy-icon">{copied ? "✓" : "⎘"}</span>
          </button>
        </div>

        <div className="cs-nav-right">
          <select className="cs-lang-select" value={language} onChange={handleLanguageChange}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <button className="cs-invite-btn" onClick={handleCopyLink}>
            <span className="cs-invite-icon">↗</span>
            {copied ? "Copied!" : "Invite"}
          </button>

          <button className="cs-run-btn" onClick={runCode} disabled={running}>
            {running
              ? <><span className="cs-run-spinner" /> Running…</>
              : <><span>▶</span> Run</>
            }
          </button>
        </div>
      </nav>

      {/* ── Body ───────────────────────────────────────── */}
      <div className="cs-body">

        <div className="cs-main">

          {/* Editor toolbar */}
          <div className="cs-editor-toolbar">
            <div className="cs-editor-breadcrumb">
              <span>main.{LANG_EXT[language] ?? "txt"}</span>
            </div>
            <div className="cs-editor-status">
              <span className="cs-status-chip">
                <span className="cs-status-dot" />
                Connected
              </span>
              <span className="cs-status-chip">{language}</span>
            </div>
          </div>

          {/* Monaco */}
          <div className="cs-editor-wrap">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineHeight: 22,
                padding: { top: 16, bottom: 16 },
                fontFamily: "'JetBrains Mono','Fira Code',monospace",
                fontLigatures: true,
                renderLineHighlight: "gutter",
                bracketPairColorization: { enabled: true },
                smoothScrolling: true,
              }}
              onChange={handleCodeChange}
            />
          </div>

          {/* ── Bottom: Input + Output side-by-side ────── */}
          <div className="cs-bottom-panels">

            {/* Tab bar (mobile / narrow hint) */}
            <div className="cs-panel-tabs">
              {PANELS.map((p) => (
                <button
                  key={p}
                  className={`cs-panel-tab${activePanel === p ? " active" : ""}`}
                  onClick={() => setActivePanel(p)}
                >
                  {p === "output" && <span className="cs-panel-tab-dot" />}
                  {p === "input" ? "stdin" : "stdout"}
                </button>
              ))}
            </div>

            <div className="cs-panel-content">

              {/* Input */}
              <div className="cs-input-panel">
                <div className="cs-panel-header">
                  <span className="cs-panel-header-label">Input</span>
                  <span className="cs-panel-header-hint">stdin</span>
                </div>
                <textarea
                  className="cs-stdin-area"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Program input (stdin)…"
                  spellCheck={false}
                />
              </div>

              {/* Output */}
              <div className="cs-output-panel">
                <div className="cs-panel-header">
                  <div className="cs-terminal-mac-dots">
                    <div className="cs-mac-dot" style={{ background: "#ff5f57" }} />
                    <div className="cs-mac-dot" style={{ background: "#febc2e" }} />
                    <div className="cs-mac-dot" style={{ background: "#28c840" }} />
                  </div>
                  <span className="cs-panel-header-hint">stdout</span>
                </div>
                <div className="cs-stdout-area">
                  {output
                    ? output
                    : <span className="cs-stdout-placeholder">▸ Run your code to see output here…</span>
                  }
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Sidebar ──────────────────────────────────── */}
        <aside className="cs-sidebar">
          <div className="cs-sidebar-header">
            <span className="cs-sidebar-title">Collaborators</span>
            <span className="cs-sidebar-count">{users.length}</span>
          </div>

          <div className="cs-user-list">
            {users.map((user, i) => {
              const isYou = user.username === currentUsername;
              return (
                <div key={user.socketId} className={`cs-user-card${isYou ? " is-you" : ""}`}>
                  <div className="cs-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                    {user.username?.charAt(0).toUpperCase() ?? "?"}
                    <span className="cs-avatar-pip" />
                  </div>
                  <div className="cs-user-info">
                    <span className="cs-user-name">{user.username}</span>
                    <span className={`cs-user-tag${isYou ? " you" : ""}`}>
                      {isYou ? "you" : "online"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Room;