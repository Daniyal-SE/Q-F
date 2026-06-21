import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { localGetAllUsers, localDeleteUser, localUpdateUser } from "@/lib/localAuth";

interface UserRecord {
  id: string;
  username: string;
  email: string;
  password?: string;
  role?: string;
  createdAt: string;
}

// ─── helpers ───────────────────────────────────────────────────────────────

const hoursAgo = (dateStr: string): number => {
  const ms = Date.now() - new Date(dateStr).getTime();
  return ms / (1000 * 60 * 60);
};

const isNewToday   = (u: UserRecord) => hoursAgo(u.createdAt) <= 24;
const isNewThisWeek = (u: UserRecord) => hoursAgo(u.createdAt) <= 168; // 7 days

const formatShortDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  } catch {
    return dateString;
  }
};

const timeAgoLabel = (dateStr: string): string => {
  const h = hoursAgo(dateStr);
  if (h < 1)   return `${Math.round(h * 60)}m ago`;
  if (h < 24)  return `${Math.floor(h)}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

// ─── component ─────────────────────────────────────────────────────────────

const AdminControl: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers]             = useState<UserRecord[]>([]);
  const [loading, setLoading]         = useState(false);
  const [errorMsg, setErrorMsg]       = useState("");
  const [activeTab, setActiveTab]     = useState<"all" | "new">("all");

  // Edit Modal State
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail,    setEditEmail]    = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving]             = useState(false);

  const getAdminEmail = () => {
    const authSaved = localStorage.getItem("userAuth");
    return authSaved ? JSON.parse(authSaved).email || "" : "";
  };

  const fetchUsers = () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = localGetAllUsers();
      // Sort newest first
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setUsers(sorted);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to load local user database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const email = getAdminEmail().toLowerCase();
    if (email !== "jugnuzulfi4855@gmail.com") {
      alert("Access Denied: Only jugnuzulfi4855@gmail.com can manage database users.");
      navigate("/dashboard");
      return;
    }
    fetchUsers();
  }, []);

  // Derived lists
  const newTodayUsers = users.filter(isNewToday).filter(u => u.role !== "admin");
  const newWeekUsers  = users.filter(isNewThisWeek).filter(u => u.role !== "admin");
  const displayedUsers = activeTab === "new" ? newTodayUsers : users;

  const handleEditClick = (user: UserRecord) => {
    setSelectedUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditPassword(user.password || "");
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSaving(true);
    const { error } = localUpdateUser(selectedUser.id, {
      username: editUsername,
      email:    editEmail,
      password: editPassword || undefined,
    });

    if (error) {
      alert(error);
    } else {
      setSelectedUser(null);
      fetchUsers();
    }
    setSaving(false);
  };

  const handleDeleteUser = (id: string, username: string) => {
    if (window.confirm(`Are you sure you want to permanently DELETE user "${username}"? 🚨`)) {
      localDeleteUser(id);
      fetchUsers();
    }
  };

  return (
    <div
      className="bg-[#050b14] text-[#dce2f6] min-h-screen p-4 relative overflow-x-hidden grid-bg flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        .grid-bg {
          background-image: 
            linear-gradient(rgba(74, 222, 128, 0.04) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(74, 222, 128, 0.04) 1.5px, transparent 1.5px);
          background-size: 32px 32px;
        }
        @keyframes borderPulse {
          0%, 100% { border-color: rgba(74,222,128,0.15); box-shadow: 0 0 15px rgba(74,222,128,0.05); }
          50%       { border-color: rgba(74,222,128,0.55); box-shadow: 0 0 25px rgba(74,222,128,0.25); }
        }
        .animated-box-border { animation: borderPulse 4s ease-in-out infinite; }
        .text-neon-glow { text-shadow: 0 0 12px rgba(74,222,128,0.5); }
        @keyframes badgePop {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1);   opacity: 1; }
        }
        .badge-new { animation: badgePop 0.4s ease-out forwards; }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
          50%     { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
        }
        .pulse-ring { animation: pulseGlow 2s ease-in-out infinite; }
      `}</style>

      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-[#4ade80]/3 blur-[160px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between py-6 border-b border-white/5 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center justify-center p-2 text-[#4ade80] hover:bg-[#4ade80]/15 rounded-xl transition-all cursor-pointer bg-transparent border-none"
          >
            <span className="material-symbols-outlined font-bold text-xl">arrow_back</span>
          </button>
          <div>
            <h1
              className="font-black tracking-tighter text-2xl text-[#00FF87] uppercase text-neon-glow"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              SQL VIEW
            </h1>
            <p className="text-[#64748b] text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">
              Kinetic User Control Database
            </p>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#131b2e] border border-slate-800 hover:border-slate-700 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Sync DB
        </button>
      </header>

      <main className="relative z-10 max-w-6xl w-full mx-auto flex-1 flex flex-col gap-6">

        {errorMsg && (
          <div className="flex items-start gap-3 bg-red-950/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-xs">
            <span className="material-symbols-outlined text-red-400 mt-0.5 shrink-0 text-base">warning</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total Users */}
          <div className="bg-[#0e1622] border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Users</span>
            <span className="text-3xl font-black text-white">{users.filter(u => u.role !== "admin").length}</span>
            <span className="text-[10px] text-slate-500">registered accounts</span>
          </div>

          {/* New Today */}
          <div className="bg-[#0e1622] border border-[#4ade80]/20 rounded-2xl p-4 flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              {newTodayUsers.length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] block pulse-ring" />
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4ade80]/70">New Today</span>
            <span className="text-3xl font-black text-[#4ade80]">{newTodayUsers.length}</span>
            <span className="text-[10px] text-slate-500">last 24 hours</span>
          </div>

          {/* New This Week */}
          <div className="bg-[#0e1622] border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">This Week</span>
            <span className="text-3xl font-black text-white">{newWeekUsers.length}</span>
            <span className="text-[10px] text-slate-500">last 7 days</span>
          </div>
        </div>

        {/* ── New Registrations Panel (only shown if there are new users) ── */}
        {newTodayUsers.length > 0 && (
          <div className="bg-[#0e1622] border border-[#4ade80]/20 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 bg-[#0a1a10] border-b border-[#4ade80]/15 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] pulse-ring" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4ade80]">
                🆕 New Registrations — Last 24 Hours
              </span>
              <span className="ml-auto text-xs bg-[#4ade80]/15 text-[#4ade80] px-2.5 py-1 rounded-full font-bold">
                {newTodayUsers.length} new
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {newTodayUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  {/* Avatar Circle */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4ade80]/30 to-[#4ade80]/10 border border-[#4ade80]/30 flex items-center justify-center shrink-0">
                    <span className="text-[#4ade80] font-black text-sm uppercase">
                      {user.username.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm uppercase tracking-wide truncate">
                        {user.username}
                      </span>
                      <span className="badge-new flex-shrink-0 text-[9px] font-black bg-[#4ade80] text-[#003919] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        NEW
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 truncate block">{user.email}</span>
                  </div>

                  {/* Time */}
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-[#4ade80]">{timeAgoLabel(user.createdAt)}</span>
                    <p className="text-[10px] text-slate-500">{formatShortDate(user.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border cursor-pointer ${
              activeTab === "all"
                ? "bg-[#4ade80]/15 border-[#4ade80]/30 text-[#4ade80]"
                : "bg-transparent border-white/5 text-slate-400 hover:border-slate-600"
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border cursor-pointer flex items-center gap-2 ${
              activeTab === "new"
                ? "bg-[#4ade80]/15 border-[#4ade80]/30 text-[#4ade80]"
                : "bg-transparent border-white/5 text-slate-400 hover:border-slate-600"
            }`}
          >
            New Today
            {newTodayUsers.length > 0 && (
              <span className="bg-[#4ade80] text-[#003919] text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {newTodayUsers.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Main Table ── */}
        <div className="w-full bg-[#0e1622] rounded-2xl border border-white/5 shadow-2xl animated-box-border overflow-hidden">
          <div className="p-4 bg-[#111927] border-b border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">
              {activeTab === "new" ? "SELECT * FROM users WHERE created_at > NOW() - INTERVAL 24 HOUR;" : "SELECT * FROM users_db ORDER BY created_at DESC;"}
            </span>
            <span className="text-xs bg-[#4ade80]/15 text-[#4ade80] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              {displayedUsers.length} Records
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <span className="material-symbols-outlined text-3xl animate-spin text-[#4ade80]">sync</span>
                <p className="text-slate-400 text-sm font-semibold">Loading users...</p>
              </div>
            ) : displayedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">
                  {activeTab === "new" ? "person_add" : "database"}
                </span>
                <p className="text-[#dce2f6] font-bold">
                  {activeTab === "new" ? "No New Registrations Today" : "No Users Found"}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {activeTab === "new"
                    ? "No new accounts were created in the last 24 hours."
                    : "Register user accounts to populate this view."}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#121a29]/50 border-b border-white/5">
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayedUsers.map((user) => {
                    const _isNew = isNewToday(user);
                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-white/[0.02] transition-colors ${_isNew ? "bg-[#4ade80]/[0.02]" : ""}`}
                      >
                        {/* Status / NEW badge */}
                        <td className="p-4">
                          {user.role === "admin" ? (
                            <span className="text-[9px] font-black bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              ADMIN
                            </span>
                          ) : _isNew ? (
                            <span className="badge-new text-[9px] font-black bg-[#4ade80] text-[#003919] px-2 py-0.5 rounded-full uppercase tracking-wider">
                              🆕 NEW
                            </span>
                          ) : (
                            <span className="text-[9px] font-black bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              USER
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-sm font-bold text-white uppercase tracking-wide">
                          {user.username}
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-300">
                          {user.email}
                        </td>
                        <td className="p-4 text-xs font-mono font-bold text-[#4ade80] max-w-[120px] truncate" title={user.password}>
                          {user.password || "[Secure/Hashed]"}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-300">{formatShortDate(user.createdAt)}</span>
                            {_isNew && (
                              <span className="text-[10px] font-bold text-[#4ade80] mt-0.5">
                                {timeAgoLabel(user.createdAt)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2.5">
                            <button
                              onClick={() => handleEditClick(user)}
                              className="p-2 bg-slate-800/60 hover:bg-[#4ade80]/15 hover:text-[#4ade80] text-[#bccabb] rounded-lg transition-all border-none cursor-pointer flex items-center justify-center"
                              title="Edit User"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            {user.role !== "admin" && (
                              <button
                                onClick={() => handleDeleteUser(user.id, user.username)}
                                className="p-2 bg-slate-800/60 hover:bg-red-500/10 hover:text-red-400 text-[#bccabb] rounded-lg transition-all border-none cursor-pointer flex items-center justify-center"
                                title="Delete User"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* ── Edit User Modal ── */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0e1622] w-full max-w-md rounded-[24px] p-6 sm:p-8 space-y-6 border border-white/5 shadow-2xl animated-box-border">

            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-xl font-black text-[#00FF87] uppercase text-neon-glow" style={{ fontFamily: "'Manrope', sans-serif" }}>
                UPDATE USER RECORD
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-white bg-transparent border-none cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] block">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-[#1b253b] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-[#dce2f6] focus:outline-none focus:border-[#4ade80]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] block">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#1b253b] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-[#dce2f6] focus:outline-none focus:border-[#4ade80]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] block">User Password (Plain Text)</label>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Enter new password to reset"
                  className="w-full bg-[#1b253b] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-[#dce2f6] focus:outline-none focus:border-[#4ade80]"
                />
                <p className="text-[9px] text-slate-500 font-medium">
                  *Leaving this field unchanged keeps the current password.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-3 rounded-xl bg-[#131b2e] border border-slate-800 text-white font-bold text-xs uppercase tracking-widest active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#6bfb9a] to-[#4ade80] text-[#003919] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#4ade80]/10 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "UPDATE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminControl;
