const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const Prediction = require("../models/Prediction");
const { verifyToken, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

// Helper to remove password before sending user object to client
const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.password;
  return user;
};

// Generate JWT helper
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. REGISTER / SIGNUP
// ─────────────────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, profile } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ success: false, error: "Password must be at least 6 characters" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check DB state
    if (mongoose.connection.readyState !== 1) {
      // In-memory fallback if MongoDB is not connected
      const mockId = new mongoose.Types.ObjectId().toString();
      const mockUser = {
        _id: mockId,
        id: mockId,
        name: name.trim(),
        email: cleanEmail,
        profile: {
          age: profile?.age ? Number(profile.age) : 25,
          gender: profile?.gender || "male",
          weight: profile?.weight ? Number(profile.weight) : 70,
          height: profile?.height ? Number(profile.height) : 175,
          activityLevel: profile?.activityLevel || "moderate",
          goal: profile?.goal || "maintain",
          bloodGroup: profile?.bloodGroup || "O+",
          allergies: profile?.allergies || [],
        },
        vitals: {
          waterIntakeGlasses: 0,
          waterGoalGlasses: 8,
          checklist: { vitamins: false, workout: false, hydration: false, sleep: false },
        },
        createdAt: new Date().toISOString(),
      };

      const token = generateToken(mockUser);
      return res.status(201).json({
        success: true,
        message: "Account created successfully (Memory Mode).",
        token,
        user: mockUser,
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: "An account with this email address already exists. Please log in.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      profile: {
        age: profile?.age ? Number(profile.age) : 25,
        gender: profile?.gender || "male",
        weight: profile?.weight ? Number(profile.weight) : 70,
        height: profile?.height ? Number(profile.height) : 175,
        activityLevel: profile?.activityLevel || "moderate",
        goal: profile?.goal || "maintain",
        bloodGroup: profile?.bloodGroup || "O+",
        allergies: profile?.allergies || [],
      },
      vitals: {
        waterIntakeGlasses: 0,
        waterGoalGlasses: 8,
        checklist: { vitamins: false, workout: false, hydration: false, sleep: false },
      },
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Unable to create account. Please try again.",
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. LOGIN
// ─────────────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide both email and password.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check DB state
    if (mongoose.connection.readyState !== 1) {
      // Demo / offline fallback
      const mockId = new mongoose.Types.ObjectId().toString();
      const mockUser = {
        _id: mockId,
        id: mockId,
        name: cleanEmail.split("@")[0] || "Health Member",
        email: cleanEmail,
        profile: {
          age: 26,
          gender: "male",
          weight: 72,
          height: 178,
          activityLevel: "moderate",
          goal: "maintain",
          bloodGroup: "A+",
          allergies: ["Peanuts (Mild)"],
        },
        vitals: {
          waterIntakeGlasses: 4,
          waterGoalGlasses: 8,
          checklist: { vitamins: true, workout: false, hydration: true, sleep: false },
        },
        createdAt: new Date().toISOString(),
      };

      const token = generateToken(mockUser);
      return res.json({
        success: true,
        message: "Login successful (Demo/Offline Mode)",
        token,
        user: mockUser,
      });
    }

    // Find User
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password. Please verify your credentials.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password. Please verify your credentials.",
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: "Login successful!",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Unable to log in. Please try again later.",
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. GET CURRENT USER PROFILE (/me)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/me", verifyToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        user: {
          _id: req.user.id,
          name: req.user.name || "Member",
          email: req.user.email,
          profile: {
            age: 26,
            gender: "male",
            weight: 72,
            height: 178,
            activityLevel: "moderate",
            goal: "maintain",
            bloodGroup: "A+",
            allergies: [],
          },
          vitals: {
            waterIntakeGlasses: 4,
            waterGoalGlasses: 8,
            checklist: { vitamins: true, workout: false, hydration: true, sleep: false },
          },
        },
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User account not found.",
      });
    }

    return res.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("❌ Get /me Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Unable to retrieve user profile.",
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. UPDATE USER PROFILE BIOMETRICS
// ─────────────────────────────────────────────────────────────────────────────
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, profile } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        message: "Profile updated successfully.",
        user: {
          _id: req.user.id,
          name: name || req.user.name,
          email: req.user.email,
          profile: profile || {},
        },
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    if (name && name.trim()) {
      user.name = name.trim();
    }

    if (profile) {
      user.profile = {
        ...user.profile.toObject(),
        ...profile,
      };
    }

    await user.save();

    return res.json({
      success: true,
      message: "Profile biometrics updated successfully!",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("❌ Profile Update Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Unable to update profile biometrics.",
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. UPDATE DAILY VITALS & HABITS
// ─────────────────────────────────────────────────────────────────────────────
router.post("/vitals", verifyToken, async (req, res) => {
  try {
    const { vitals } = req.body;

    if (!vitals) {
      return res.status(400).json({ success: false, error: "No vitals provided." });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        vitals,
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    user.vitals = {
      ...user.vitals.toObject(),
      ...vitals,
    };

    await user.save();

    return res.json({
      success: true,
      vitals: user.vitals,
    });
  } catch (error) {
    console.error("❌ Vitals Update Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to update daily vitals.",
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. GET USER'S PREDICTION HISTORY
// ─────────────────────────────────────────────────────────────────────────────
router.get("/history", verifyToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        history: [],
      });
    }

    const history = await Prediction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("❌ Get History Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Unable to fetch prediction history.",
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. DELETE A PREDICTION RECORD FROM HISTORY
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/history/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        message: "Record deleted.",
      });
    }

    const result = await Prediction.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Record not found or already removed.",
      });
    }

    return res.json({
      success: true,
      message: "Health diagnosis record removed successfully.",
    });
  } catch (error) {
    console.error("❌ Delete History Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to remove diagnosis record.",
    });
  }
});

module.exports = router;
