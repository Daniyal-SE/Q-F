import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const AVATAR_OPTIONS = [
  {
    id: "avatar1",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyqSkxgPgV8K8zonxfMvoCrSjROduKvwKQFVJMJGZVJWGG59LCS9mEd2ByEhZrfVA9PpPN48YEC4KUgk7RzQ1kTMIWf_5bcCbflNQExfEXV0MPEw8OjfWvMH4cJMkqVTcqY8nHUyAdu4pfg61ws55L46w3bV1eO5AAP-VIMSTsWHIr4CVqi0lUc_0KuhhPjO-nnL3ZyMExY57ly_iKhjf71kzS4s3frs3EztUZ1iC2VAwkl4N41uDXaR9dh8PTF1ukLNJjdBLXT4DP",
    name: "Classic Wave",
    free: true,
  },
  {
    id: "avatar2",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrtEbJwabEkaISRdvyFRba2fvrB350jtj_MKbN8WifPvcV_ZhZb9tmSBNVMDkcLEH2dLbN4EBScfJ0EuyIeBS9z-mPEkzEbYUE8u0wPOE7UiploiltXh6wiaTqt-dtt3Q-qA6Q5CpV20BkhQ6EvpAwHXdSbkEFm9aeI_d-thv6iRi-MIL11s1dRKE9tPl6jGw9NKUGT-bZMZTx1i-3-m9ZfLBL3ALsSvqeIpQ2h4aLWYTC5EG7bzfkypApIQSPvnyVeokars7Hvwz4",
    name: "Energy Bolt",
    free: true,
  },
];

interface UserProfile {
  username: string;
  avatar: string;
}

interface StreakData {
  startTime: number | null;
  elapsedTime: number;
  totalDays: number;
  precision: string | null;
  customPrecision?: string;
  plan?: "student" | "work" | "flexible";
  notificationSent: boolean;
  preNotificationSent: boolean;
}

const SettingsScreen = () => {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [username, setUsername] = useState("Disciplined User");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].id);
  const [editInputValue, setEditInputValue] = useState(username);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [userAuth, setUserAuth] = useState<{ role: string; name?: string } | null>(null);
  const [motivators, setMotivators] = useState<{ id: string; text: string; emoji: string }[]>([]);
  const [newMotivatorText, setNewMotivatorText] = useState("");
  const [newMotivatorEmoji, setNewMotivatorEmoji] = useState("💪");
  const EMOJI_OPTIONS = ["💪", "❤️", "👨‍👩‍👧", "⚡", "💰", "🏆", "🌟", "🔥", "🧠", "🎯"];

  // Load user profile and streak data
  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      const profile = JSON.parse(saved);
      setUsername(profile.username);
      setEditInputValue(profile.username);
      setSelectedAvatar(profile.avatar);
    }

    const streakSaved = localStorage.getItem("streakData");
    if (streakSaved) {
      setStreakData(JSON.parse(streakSaved));
    }

    const authSaved = localStorage.getItem("userAuth");
    if (authSaved) {
      setUserAuth(JSON.parse(authSaved));
    }

    const motivatorsSaved = localStorage.getItem("motivators");
    setMotivators(motivatorsSaved ? JSON.parse(motivatorsSaved) : [
      { id: "1", text: "My Family", emoji: "👨‍👩‍👧" },
      { id: "2", text: "Feel Energetic", emoji: "⚡" },
      { id: "3", text: "Save Money", emoji: "💰" },
    ]);
  }, []);

  // Save profile to localStorage
  useEffect(() => {
    const profile: UserProfile = {
      username,
      avatar: selectedAvatar,
    };
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [username, selectedAvatar]);

  const handleSaveName = () => {
    if (editInputValue.trim()) {
      setUsername(editInputValue.trim());
      setIsEditingName(false);
    }
  };

  const handleAvatarChange = (avatarId: string) => {
    setSelectedAvatar(avatarId);
  };

  const getCurrentAvatar = () => {
    return (
      AVATAR_OPTIONS.find((a) => a.id === selectedAvatar)?.url ||
      AVATAR_OPTIONS[0].url
    );
  };

  const handleAddMotivator = () => {
    if (!newMotivatorText.trim()) return;
    const updated = [
      ...motivators,
      { id: Date.now().toString(), text: newMotivatorText.trim(), emoji: newMotivatorEmoji },
    ];
    setMotivators(updated);
    localStorage.setItem("motivators", JSON.stringify(updated));
    setNewMotivatorText("");
  };

  const handleRemoveMotivator = (id: string) => {
    const updated = motivators.filter((m) => m.id !== id);
    setMotivators(updated);
    localStorage.setItem("motivators", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    navigate("/auth");
  };

  return (
    <div className="bg-kinetic-surface text-kinetic-on-surface font-body min-h-screen flex flex-col custom-scrollbar">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--kinetic-surface);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--kinetic-surface-container);
          border-radius: 10px;
        }
      `}</style>

      {/* TopAppBar */}
      <header className="w-full top-0 z-50 sticky bg-[#0c1321] flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="hover:opacity-80 transition-opacity flex items-center justify-center p-1 rounded-full cursor-pointer text-[#4ade80]"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl font-bold">
              arrow_back
            </span>
          </button>

          <h1
            className="font-black tracking-tighter text-lg sm:text-2xl text-[#4ade80] uppercase"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            KINETIC
          </h1>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#3d4a3e] hover:opacity-80 transition-opacity cursor-pointer">
          <img
            alt="User profile"
            className="w-full h-full object-cover"
            src={getCurrentAvatar()}
          />
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 pb-24 sm:pb-32 pt-4 max-w-2xl mx-auto w-full">
        {/* Profile Header Section */}
        <section className="mb-10 animate-fade-in">
          <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl bg-kinetic-surface-container">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-kinetic-primary">
                <img
                  alt="Profile"
                  className="w-full h-full object-cover"
                  src={getCurrentAvatar()}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              {isEditingName ? (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={editInputValue}
                    onChange={(e) => setEditInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSaveName();
                    }}
                    className="flex-1 px-3 py-2 bg-kinetic-surface-container border border-kinetic-primary rounded-lg text-kinetic-on-surface font-black focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-2 bg-kinetic-primary text-kinetic-on-primary rounded-lg font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="px-3 py-2 bg-kinetic-surface-container text-kinetic-on-surface rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg sm:text-2xl font-black tracking-tight text-kinetic-on-surface">
                    {username}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 hover:bg-kinetic-surface-container rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-kinetic-primary text-lg">
                      edit
                    </span>
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-kinetic-primary font-bold text-sm uppercase tracking-wider">
                  Current Streak: {streakData?.totalDays || 0} Days
                </span>
              </div>
              <p className="text-kinetic-on-surface-variant text-xs mt-1 font-medium opacity-80 uppercase tracking-widest">
                Level {Math.floor((streakData?.totalDays || 0) / 5) + 1} Coach
              </p>
            </div>
          </div>
        </section>

        {/* Guest Banner */}
        {userAuth?.role === "guest" && (
          <div className="mb-6 p-4 rounded-xl bg-[#ff9a3c]/10 border border-[#ff9a3c]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ff9a3c] text-2xl">person_off</span>
              <div>
                <p className="text-[#ff9a3c] font-black text-sm">You're browsing as Guest</p>
                <p className="text-[#ff9a3c]/70 text-xs mt-0.5">Sign up to save your progress permanently</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 bg-[#ff9a3c] text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#e8882a] transition flex-shrink-0"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Motivators Section */}
        <div className="mb-8">
          <h3 className="text-xs font-black text-kinetic-on-surface-variant tracking-[0.2em] uppercase mb-4">My Motivators</h3>
          <div className="bg-kinetic-surface-container-low rounded-xl p-4 space-y-3 mb-4">
            {motivators.length === 0 ? (
              <p className="text-kinetic-on-surface-variant text-sm text-center py-3 opacity-60">No motivators yet. Add one below!</p>
            ) : (
              motivators.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-kinetic-surface-container">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{m.emoji}</span>
                    <span className="font-bold text-kinetic-on-surface text-sm">{m.text}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveMotivator(m.id)}
                    className="text-kinetic-on-surface-variant hover:text-red-400 transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              ))
            )}
          </div>
          {/* Add new motivator */}
          <div className="bg-kinetic-surface-container-low rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-kinetic-on-surface-variant uppercase tracking-widest">Add Motivator</p>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setNewMotivatorEmoji(e)}
                  className={`text-xl w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    newMotivatorEmoji === e
                      ? "bg-kinetic-primary/20 ring-2 ring-kinetic-primary scale-110"
                      : "bg-kinetic-surface-container hover:bg-kinetic-surface-container-high"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMotivatorText}
                onChange={(e) => setNewMotivatorText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMotivator()}
                placeholder="e.g., My family, Feel healthy..."
                className="flex-1 px-4 py-2 text-sm bg-kinetic-surface-container rounded-lg text-kinetic-on-surface placeholder-kinetic-on-surface-variant/40 border border-kinetic-outline/20 focus:outline-none focus:border-kinetic-primary"
              />
              <button
                onClick={handleAddMotivator}
                className="px-4 py-2 bg-kinetic-primary text-kinetic-on-primary font-bold text-sm rounded-lg hover:opacity-90 transition active:scale-95"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="mb-6 sm:mb-10">
          <h3 className="text-xs font-black text-kinetic-on-surface-variant tracking-[0.2em] uppercase mb-4">
            Choose Your Avatar
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {AVATAR_OPTIONS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleAvatarChange(avatar.id)}
                className={`relative rounded-xl overflow-hidden transition-all duration-300 ${selectedAvatar === avatar.id
                    ? "ring-2 ring-kinetic-primary scale-105"
                    : "ring-1 ring-kinetic-outline-variant/20"
                  }`}
              >
                <div className="aspect-square overflow-hidden bg-kinetic-surface-container">
                  <img
                    src={avatar.url}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 flex items-end p-3">
                  <div className="w-full">
                    <p className="text-white font-bold text-sm">
                      {avatar.name}
                    </p>
                    <p className="text-white/70 text-xs">
                      {avatar.free ? "✓ Free" : "Premium"}
                    </p>
                  </div>
                </div>
                {selectedAvatar === avatar.id && (
                  <div className="absolute top-2 right-2 bg-kinetic-primary text-kinetic-on-primary rounded-full p-1">
                    <span className="material-symbols-outlined text-lg">
                      check_circle
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Title */}
        <div className="mb-6">
          <h3 className="text-xs font-black text-kinetic-on-surface-variant tracking-[0.2em] uppercase">
            Preferences
          </h3>
        </div>

        {/* Settings List Layout */}
        <div className="bg-kinetic-surface-container-low rounded-xl overflow-hidden mb-8">
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4 sm:p-5 transition-colors hover:bg-kinetic-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-kinetic-surface-container flex items-center justify-center text-kinetic-primary">
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <span className="font-bold text-kinetic-on-surface tracking-wide">
                Notifications
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input defaultChecked className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-kinetic-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-kinetic-primary"></div>
            </label>
          </div>
          <div className="h-[1px] bg-kinetic-outline-variant/10 mx-5"></div>

          {/* Reminders Toggle */}
          <div className="flex items-center justify-between p-4 sm:p-5 transition-colors hover:bg-kinetic-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-kinetic-surface-container flex items-center justify-center text-kinetic-primary">
                <span className="material-symbols-outlined">alarm</span>
              </div>
              <span className="font-bold text-kinetic-on-surface tracking-wide">
                Reminders
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input defaultChecked className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-kinetic-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-kinetic-primary"></div>
            </label>
          </div>
          <div className="h-[1px] bg-kinetic-outline-variant/10 mx-5"></div>

          {/* Face ID Login Toggle */}
          <div className="flex items-center justify-between p-4 sm:p-5 transition-colors hover:bg-kinetic-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-kinetic-surface-container flex items-center justify-center text-kinetic-primary">
                <span className="material-symbols-outlined">face</span>
              </div>
              <span className="font-bold text-kinetic-on-surface tracking-wide">
                Face ID Login
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-kinetic-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-kinetic-primary"></div>
            </label>
          </div>
        </div>

        {/* Dangerous Actions */}
        <div className="mb-4">
          <h3 className="text-xs font-black text-secondary tracking-[0.2em] uppercase">
            Account Security
          </h3>
        </div>
        <button className="w-full group bg-kinetic-surface-container hover:bg-secondary/10 transition-all p-5 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">delete_forever</span>
            </div>
            <span className="font-bold text-secondary tracking-wide">
              Reset All Data
            </span>
          </div>
          <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
        </button>

        {/* Logout / Account */}
        <div className="mt-6 mb-4">
          <button
            onClick={handleLogout}
            className="w-full group bg-kinetic-surface-container hover:bg-red-500/10 transition-all p-5 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                <span className="material-symbols-outlined">logout</span>
              </div>
              <span className="font-bold text-red-400 tracking-wide">Sign Out</span>
            </div>
            <span className="material-symbols-outlined text-red-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </div>

        {/* App Version */}
        <div className="mt-8 text-center">
          <p className="text-kinetic-on-surface-variant text-[10px] font-bold tracking-[0.3em] uppercase opacity-40">
            Kinetic Precision v2.4.0
          </p>
        </div>
      </main>

      {/* BottomNavBar */}
      <BottomNav active="settings" />
    </div>
  );
};

export default SettingsScreen;
