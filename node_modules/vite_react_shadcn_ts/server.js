import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kinetic";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to local JSON database file
const USERS_DB_FILE = path.join(__dirname, "users_db.json");

app.use(cors());
app.use(express.json());

// Database connection status tracker
let isDbConnected = false;

const seedAdminAccount = async () => {
  try {
    const adminEmail = "jugnuzulfi4855@gmail.com";
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      const hashedPassword = await bcrypt.hash("jugnu123@", 10);
      const adminUser = new User({
        username: "Admin Zulfi",
        email: adminEmail,
        password: hashedPassword
      });
      await adminUser.save();
      console.log("Admin account seeded in MongoDB successfully! Email: jugnuzulfi4855@gmail.com");
    }

    // Sync from Mongo to local file
    await syncMongoToLocalFile();

    // Ensure users_db.json plain text password for admin is correct
    const fileUsers = readUsersFromFile();
    const adminRecordIndex = fileUsers.findIndex(u => u.email === adminEmail);
    if (adminRecordIndex !== -1) {
      if (fileUsers[adminRecordIndex].password !== "jugnu123@") {
        fileUsers[adminRecordIndex].password = "jugnu123@";
        writeUsersToFile(fileUsers);
      }
    }
  } catch (err) {
    console.error("Failed to seed admin account:", err);
  }
};

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully! Database URI:", MONGODB_URI);
    isDbConnected = true;
    seedAdminAccount(); // Seed admin account and sync local file
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB at", MONGODB_URI);
    console.error("Error details:", err.message);
    console.log("The server will run but authentication operations requiring DB will fail until MongoDB is active.");
  });

// Schema definition
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

// File helper functions
const readUsersFromFile = () => {
  try {
    if (!fs.existsSync(USERS_DB_FILE)) {
      fs.writeFileSync(USERS_DB_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(USERS_DB_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading users from file:", err);
    return [];
  }
};

const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(USERS_DB_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing users to file:", err);
  }
};

// Sync database users to local file (e.g. if the file is missing or on startup)
const syncMongoToLocalFile = async () => {
  try {
    const mongoUsers = await User.find({});
    const fileUsers = readUsersFromFile();

    // Map existing users from Mongo, maintaining existing plain-text passwords in file if already present
    const updatedUsers = mongoUsers.map((mu) => {
      const existing = fileUsers.find(fu => fu.email === mu.email);
      return {
        id: mu._id.toString(),
        username: mu.username,
        email: mu.email,
        password: existing ? existing.password : "[Hashed/Protected]", // Use actual plain text if we have it, otherwise label it
        passwordHash: mu.password,
        createdAt: mu.createdAt
      };
    });

    writeUsersToFile(updatedUsers);
    console.log(`Synchronized ${updatedUsers.length} users from MongoDB to users_db.json`);
  } catch (err) {
    console.error("Failed to sync database to local file:", err);
  }
};

// Middleware to check DB connection
const checkDbConnection = (req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({
      message: "Database is offline. Please make sure MongoDB is running on your machine and try again."
    });
  }
  next();
};

// Middleware to check if request is from the admin
const checkAdminAuth = (req, res, next) => {
  const adminEmail = req.headers["x-admin-email"] || req.body.adminEmail;
  if (!adminEmail || adminEmail.trim().toLowerCase() !== "jugnuzulfi4855@gmail.com") {
    return res.status(403).json({
      message: "Access Denied: You do not have permission to access the User Database."
    });
  }
  next();
};

// Register endpoint
app.post("/api/auth/register", checkDbConnection, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to db
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Sync to local JSON file
    const fileUsers = readUsersFromFile();
    fileUsers.push({
      id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email.toLowerCase(),
      password: password, // Store plain text password as requested for direct control
      passwordHash: hashedPassword,
      createdAt: newUser.createdAt
    });
    writeUsersToFile(fileUsers);

    console.log(`User registered successfully: ${username} (${email}) - synced to users_db.json`);

    return res.status(201).json({
      message: "Account registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: "user"
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error during registration." });
  }
});

// Sign In endpoint
app.post("/api/auth/signin", checkDbConnection, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    console.log(`User logged in: ${user.username}`);

    return res.status(200).json({
      message: "Signed in successfully!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: "user"
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error during sign in." });
  }
});

// ── Admin Database Control Panel Endpoints ──

// 1. Get all users
app.get("/api/admin/users", checkAdminAuth, (req, res) => {
  try {
    // Read directly from the file to ensure we get the plain text passwords too
    const users = readUsersFromFile();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Admin fetch users error:", error);
    return res.status(500).json({ message: "Failed to read local users database file." });
  }
});

// 2. Update user profile/password (SQL-like command execution)
app.post("/api/admin/users/update", checkDbConnection, checkAdminAuth, async (req, res) => {
  try {
    const { id, username, email, password } = req.body;

    if (!id || !username || !email) {
      return res.status(400).json({ message: "User ID, Username and Email are required." });
    }

    // Update in MongoDB
    const mongoUser = await User.findById(id);
    if (!mongoUser) {
      return res.status(404).json({ message: "User not found in MongoDB database." });
    }

    mongoUser.username = username;
    mongoUser.email = email.toLowerCase();

    let hashedPassword = mongoUser.password;
    if (password && password !== "[Hashed/Protected]") {
      hashedPassword = await bcrypt.hash(password, 10);
      mongoUser.password = hashedPassword;
    }

    await mongoUser.save();

    // Update in local file users_db.json
    const fileUsers = readUsersFromFile();
    const index = fileUsers.findIndex((u) => u.id === id);
    if (index !== -1) {
      fileUsers[index] = {
        ...fileUsers[index],
        username,
        email: email.toLowerCase(),
        password: (password && password !== "[Hashed/Protected]") ? password : fileUsers[index].password,
        passwordHash: hashedPassword
      };
      writeUsersToFile(fileUsers);
    }

    console.log(`Admin updated user profile: ${username} (${email})`);
    return res.status(200).json({ message: "User profile updated successfully in SQL/JSON and MongoDB!" });

  } catch (error) {
    console.error("Admin update user error:", error);
    return res.status(500).json({ message: "Failed to update user profile." });
  }
});

// 3. Delete user account (SQL-like delete)
app.post("/api/admin/users/delete", checkDbConnection, checkAdminAuth, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required for deletion." });
    }

    // Delete in MongoDB
    await User.findByIdAndDelete(id);

    // Delete in local file users_db.json
    const fileUsers = readUsersFromFile();
    const updated = fileUsers.filter((u) => u.id !== id);
    writeUsersToFile(updated);

    console.log(`Admin deleted user ID: ${id}`);
    return res.status(200).json({ message: "User account deleted successfully from databases!" });

  } catch (error) {
    console.error("Admin delete user error:", error);
    return res.status(500).json({ message: "Failed to delete user." });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`Kinetic backend server is running on http://localhost:${PORT}`);
});
