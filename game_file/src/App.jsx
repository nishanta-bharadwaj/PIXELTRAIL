import { useState, useEffect } from "react";
import Game from "./game/Game";
import "./App.css";

// Capture console errors and global uncaught errors into localStorage
const setupErrorTracking = () => {
  if (window.hasSetupErrorTracking) return;
  window.hasSetupErrorTracking = true;

  window.addEventListener("error", (event) => {
    const errText = `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;
    const logs = JSON.parse(localStorage.getItem("game_errors") || "[]");
    logs.push(`GLOBAL ERROR: ${errText}`);
    localStorage.setItem("game_errors", JSON.stringify(logs.slice(-30))); // keep last 30 logs
    window.dispatchEvent(new Event("game_errors_updated"));
  });

  const originalConsoleError = console.error;
  console.error = function (...args) {
    const msg = args.map(arg => {
      if (arg instanceof Error) return arg.message + "\n" + arg.stack;
      return typeof arg === "object" ? JSON.stringify(arg) : String(arg);
    }).join(" ");
    const logs = JSON.parse(localStorage.getItem("game_errors") || "[]");
    logs.push(`CONSOLE ERROR: ${msg}`);
    localStorage.setItem("game_errors", JSON.stringify(logs.slice(-30)));
    window.dispatchEvent(new Event("game_errors_updated"));
    originalConsoleError.apply(console, args);
  };
};

setupErrorTracking();

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const updateLogs = () => {
      setLogs(JSON.parse(localStorage.getItem("game_errors") || "[]"));
    };
    
    updateLogs();
    window.addEventListener("game_errors_updated", updateLogs);
    return () => window.removeEventListener("game_errors_updated", updateLogs);
  }, []);

  const clearLogs = () => {
    localStorage.removeItem("game_errors");
    setLogs([]);
  };

  return (
    <div className="app">
      {logs.length > 0 && (
        <div style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          right: "10px",
          maxHeight: "300px",
          overflowY: "auto",
          background: "rgba(0, 0, 0, 0.9)",
          border: "2px solid #ff5b6e",
          borderRadius: "8px",
          color: "#ff5b6e",
          fontFamily: "monospace",
          fontSize: "12px",
          padding: "15px",
          zIndex: 99999,
          boxShadow: "0 4px 15px rgba(0,0,0,0.5)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", borderBottom: "1px solid #ff5b6e", paddingBottom: "5px" }}>
            <span style={{ fontWeight: "bold" }}>⚠️ SYSTEM DIAGNOSTIC ERROR LOGS:</span>
            <button 
              onClick={clearLogs} 
              style={{
                background: "#ff5b6e",
                color: "#000",
                border: "none",
                borderRadius: "4px",
                padding: "2px 8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Clear Logs
            </button>
          </div>
          <ul style={{ margin: 0, paddingLeft: "15px" }}>
            {logs.map((err, i) => (
              <li key={i} style={{ marginBottom: "5px", color: err.includes("CONSOLE") ? "#ffb74d" : "#ff5b6e" }}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      <Game />
    </div>
  );
}

export default App;