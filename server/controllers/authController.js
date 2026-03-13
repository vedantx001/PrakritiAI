import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

/**
 * REGISTER
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (age === undefined || age === null || String(age).trim() === "")
      return res.status(400).json({ message: "Age is required" });

    if (gender === undefined || gender === null || String(gender).trim() === "")
      return res.status(400).json({ message: "Gender is required" });

    let parsedAge;
    parsedAge = Number(age);
    if (!Number.isFinite(parsedAge) || parsedAge < 0 || parsedAge > 150) {
      return res.status(400).json({ message: "Invalid age" });
    }

    let normalizedGender;
    normalizedGender = String(gender).trim().toLowerCase();
    if (!['male', 'female'].includes(normalizedGender)) {
      return res.status(400).json({ message: "Gender must be Male or Female" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const isAdmin =
      email === process.env.SUPER_ADMIN_EMAIL &&
      password === process.env.SUPER_ADMIN_PASSWORD;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age: parsedAge,
      gender: normalizedGender,
      role: isAdmin ? "admin" : "user",
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

/**
 * GET PROFILE (Protected)
 */
export const getProfile = async (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user,
  });
};

/**
 * UPDATE PROFILE (Protected)
 * Allows updating: name, email, age, gender, password (optional)
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, email, age, gender, password } = req.body || {};

    const update = {};

    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (!trimmedName) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      update.name = trimmedName;
    }

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();
      if (!normalizedEmail) {
        return res.status(400).json({ message: "Email cannot be empty" });
      }

      // Only check uniqueness if email is changing.
      if (normalizedEmail !== String(req.user.email).toLowerCase()) {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          return res.status(409).json({ message: "Email already in use" });
        }
      }
      update.email = normalizedEmail;
    }

    if (age !== undefined) {
      const parsedAge = Number(age);
      if (!Number.isFinite(parsedAge) || parsedAge < 0 || parsedAge > 150) {
        return res.status(400).json({ message: "Invalid age" });
      }
      update.age = parsedAge;
    }

    if (gender !== undefined) {
      const normalizedGender = String(gender).trim().toLowerCase();
      if (!['male', 'female'].includes(normalizedGender)) {
        return res.status(400).json({ message: "Gender must be Male or Female" });
      }
      update.gender = normalizedGender;
    }

    if (password !== undefined && String(password).trim() !== "") {
      const rawPassword = String(password);
      if (rawPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      update.password = hashedPassword;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed", error });
  }
};
