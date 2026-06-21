import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "@/lib/apiUrl";

interface UserRecord {
  id: string;
  username: string;
  email: string;
  password?: string;
  passwordHash?: string;
  createdAt: string;
}

const AdminControl: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Edit Modal State
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const getAdminEmail = () => {
    const authSaved = localStorage.getItem("userAuth");
    return authSaved ? JSON.parse(authSaved).email || "" : "";
  };

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch(getApiUrl("/api/admin/users"), {
        headers: {
          "x-admin-email": getAdminEmail()
        }
      });
      if (!response.ok) {
        throw new Error("Failed to load users database from server.");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to load database. Make sure backend and MongoDB are running.");
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

  const handleEditClick = (user: UserRecord) => {
    setSelectedUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditPassword(user.password || "");
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSaving(true);
    try {
      const response = await fetch(getApiUrl("/api/admin/users/update"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-email": getAdminEmail()
        },
        body: JSON.stringify({
          id: selectedUser.id,
          username: editUsername,
          email: editEmail,
          password: editPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update user.");
      }

      alert("User database updated successfully! Sync complete.");
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      const error = err as Error;
      alert(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (window.confirm(`Are you sure you want to permanently DELETE user "${username}"? This will erase them from MongoDB and users_db.json! 🚨`)) {
      try {
        const response = await fetch(getApiUrl("/api/admin/users/delete"), {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-admin-email": getAdminEmail()
          },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Deletion failed.");
        }

        alert("User record deleted from all databases!");
        fetchUsers();
      } catch (err) {
        const error = err as Error;
        alert(error.message || "Failed to delete user.");
      }
    }
  };

  const formatShortDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
    } catch (e) {
      return dateString;
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
          0%, 100% {
            border-color: rgba(74, 222, 128, 0.15);
            box-shadow: 0 0 15px rgba(74, 222, 128, 0.05);
          }
          50% {
            border-color: rgba(74, 222, 128, 0.55);
            box-shadow: 0 0 25px rgba(74, 222, 128, 0.25);
          }
        }
        .animated-box-border {
          animation: borderPulse 4s ease-in-out infinite;
        }
        .text-neon-glow {
          text-shadow: 0 0 12px rgba(74, 222, 128, 0.5);
        }
      `}</style>

      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-[#4ade80]/3 blur-[160px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between py-6 border-b border-white/5 mb-8">
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

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl w-full mx-auto flex-1 flex flex-col">
        {errorMsg && (
          <div className="mb-6 flex items-start gap-3 bg-red-950/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-xs">
            <span className="material-symbols-outlined text-red-400 mt-0.5 shrink-0 text-base">warning</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Database SQL Table */}
        <div className="w-full bg-[#0e1622] rounded-2xl border border-white/5 shadow-2xl animated-box-border overflow-hidden">
          <div className="p-4 bg-[#111927] border-b border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">
              SELECT * FROM users_db;
            </span>
            <span className="text-xs bg-[#4ade80]/15 text-[#4ade80] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              {users.length} Records found
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <span className="material-symbols-outlined text-3xl animate-spin text-[#4ade80]">sync</span>
                <p className="text-slate-400 text-sm font-semibold">Reading users_db.json file...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">database</span>
                <p className="text-[#dce2f6] font-bold">No Users Found</p>
                <p className="text-slate-500 text-xs mt-1">Register user accounts to populate this view.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#121a29]/50 border-b border-white/5">
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Created At</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-xs font-mono text-slate-500 max-w-[80px] truncate" title={user.id}>
                        {user.id}
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
                      <td className="p-4 text-xs text-slate-400">
                        {formatShortDate(user.createdAt)}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2.5">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="p-2 bg-slate-800/60 hover:bg-[#4ade80]/15 hover:text-[#4ade80] text-[#bccabb] rounded-lg transition-all border-none cursor-pointer flex items-center justify-center"
                            title="Edit User profile"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            className="p-2 bg-slate-800/60 hover:bg-red-500/10 hover:text-red-400 text-[#bccabb] rounded-lg transition-all border-none cursor-pointer flex items-center justify-center"
                            title="Delete User"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Edit User Modal */}
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
                <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] block">
                  Username
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-[#1b253b] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-[#dce2f6] focus:outline-none focus:border-[#4ade80]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#1b253b] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-[#dce2f6] focus:outline-none focus:border-[#4ade80]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] block">
                  User Password (Plain Text)
                </label>
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
