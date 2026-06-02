import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import MovieDetail from "./pages/MovieDetail";
import AnimeDetail from "./pages/AnimeDetail";
import WatchPage from "./pages/WatchPage";
import TMDBDetail from "./pages/TMDBDetail";
import OTTPage from "./pages/OTTPage";
import SeeAllPage from "./pages/SeeAllPage";
import CastDetailPage from "./pages/CastDetailPage";
import { Lock } from "lucide-react";

const APP_USERS = [
  { username: "tayyab4855", pin: "0319" },
  { username: "admin", pin: "1234" },
];

// ── PinGate — shown on every page refresh when a session exists ───────────────
function PinGate({ onVerified }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const sessionUser = sessionStorage.getItem("cinestream_user") || "";
    const userConfig = APP_USERS.find((u) => u.username === sessionUser) || {
      pin: "1234",
    };

    if (pin === userConfig.pin) {
      onVerified();
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #13131a 50%, #0d0d14 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "40px 36px",
          width: "90%",
          maxWidth: "380px",
          textAlign: "center",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: "22px",
            fontWeight: 800,
            letterSpacing: "3px",
            color: "#E50914",
            marginBottom: "28px",
          }}
        >
          CINESTREAM
        </div>

        {/* Icon */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(229,9,20,0.12)",
            border: "1px solid rgba(229,9,20,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Lock size={26} color="#E50914" />
        </div>

        <h2
          style={{
            margin: "0 0 8px",
            fontSize: "20px",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          Enter Your PIN
        </h2>
        <p
          style={{
            margin: "0 0 28px",
            fontSize: "13px",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.5,
          }}
        >
          Session resumed. Enter your 4-digit PIN to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="••••"
            autoFocus
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px",
              padding: "16px",
              color: "white",
              fontSize: "28px",
              letterSpacing: "18px",
              textAlign: "center",
              outline: "none",
              marginBottom: "12px",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#E50914")}
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.15)")
            }
          />
          {error && (
            <p
              style={{ color: "#E50914", fontSize: "13px", margin: "0 0 12px" }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pin.length !== 4}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background:
                pin.length === 4
                  ? "linear-gradient(135deg, #E50914 0%, #ff4444 100%)"
                  : "rgba(255,255,255,0.08)",
              color: pin.length === 4 ? "white" : "rgba(255,255,255,0.3)",
              fontSize: "15px",
              fontWeight: 700,
              cursor: pin.length === 4 ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              letterSpacing: "0.5px",
              boxShadow:
                pin.length === 4 ? "0 4px 20px rgba(229,9,20,0.4)" : "none",
            }}
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // In-memory flag — resets to false on every page refresh/reload
  const [pinVerified, setPinVerified] = useState(false);

  const hasSession = sessionStorage.getItem("cinestream_session") === "active";

  // If user has an active session but PIN hasn't been verified this page-load → show PIN gate
  if (hasSession && !pinVerified) {
    return <PinGate onVerified={() => setPinVerified(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — all require active session */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MovieDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/anime/:id"
          element={
            <ProtectedRoute>
              <AnimeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watch/:id"
          element={
            <ProtectedRoute>
              <WatchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tmdb/:id"
          element={
            <ProtectedRoute>
              <TMDBDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform/:platformId"
          element={
            <ProtectedRoute>
              <OTTPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/anime"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/series"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/see-all"
          element={
            <ProtectedRoute>
              <SeeAllPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/person/:id"
          element={
            <ProtectedRoute>
              <CastDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mylist"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
