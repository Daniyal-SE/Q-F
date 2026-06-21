/**
 * localAuth.ts
 * Pure localStorage-based authentication system.
 * Works completely offline — no backend server or MongoDB required.
 */

const USERS_KEY = "kinetic_users_db";
const ADMIN_EMAIL = "jugnuzulfi4855@gmail.com";
const ADMIN_PASSWORD = "jugnu123@";
const ADMIN_USERNAME = "Admin Zulfi";

export interface LocalUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: string;
}

/** Seed the admin account into local storage if not already present */
const seedAdmin = (): void => {
  const users = getAllUsers();
  const exists = users.find(
    (u) => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );
  if (!exists) {
    users.push({
      id: "admin-zulfi-001",
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    saveAllUsers(users);
  }
};

const getAllUsers = (): LocalUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveAllUsers = (users: LocalUser[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/** Register a new user. Returns error string on failure, user on success. */
export const localRegister = (
  username: string,
  email: string,
  password: string
): { error: string | null; user: LocalUser | null } => {
  seedAdmin();
  const users = getAllUsers();

  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: "Email is already registered.", user: null };
  }
  if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { error: "Username is already taken.", user: null };
  }

  const newUser: LocalUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    username,
    email: email.toLowerCase(),
    password,
    role: "user",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveAllUsers(users);
  return { error: null, user: newUser };
};

/** Sign in with email + password. Returns error string on failure, user on success. */
export const localSignIn = (
  email: string,
  password: string
): { error: string | null; user: LocalUser | null } => {
  seedAdmin();
  const users = getAllUsers();

  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!found) {
    return { error: "Invalid email or password.", user: null };
  }
  if (found.password !== password) {
    return { error: "Invalid email or password.", user: null };
  }
  return { error: null, user: found };
};

/** Get all registered users (for admin panel) */
export const localGetAllUsers = (): LocalUser[] => {
  seedAdmin();
  return getAllUsers();
};

/** Delete a user by id */
export const localDeleteUser = (id: string): void => {
  const users = getAllUsers().filter((u) => u.id !== id);
  saveAllUsers(users);
};

/** Update a user */
export const localUpdateUser = (
  id: string,
  updates: Partial<Pick<LocalUser, "username" | "email" | "password">>
): { error: string | null } => {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return { error: "User not found." };

  if (updates.email) {
    const conflict = users.find(
      (u, i) =>
        i !== idx && u.email.toLowerCase() === updates.email!.toLowerCase()
    );
    if (conflict) return { error: "Email is already in use by another user." };
    users[idx].email = updates.email.toLowerCase();
  }
  if (updates.username) users[idx].username = updates.username;
  if (updates.password) users[idx].password = updates.password;

  saveAllUsers(users);
  return { error: null };
};
