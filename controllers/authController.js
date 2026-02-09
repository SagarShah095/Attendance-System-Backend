const User = require("../models/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  const {
    email,
    password,
    role,
    name,
    profilePicture,
    gender,
    dateOfBirth,
    phoneNumber,
    salary,
    position,
    department,
    address,
    city
  } = req.body;

  try {
    // Check required fields
    if (
      !email ||
      !password ||
      !role ||
      !name ||
      !gender ||
      !dateOfBirth ||
      !phoneNumber ||
      !salary ||
      !position ||
      !department ||
      !address ||
      !city
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      name,
      profilePicture,
      gender,
      dateOfBirth,
      phoneNumber,
      salary,
      position,
      department,
      address,
      city,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: { $ne: "admin" }
    }).select("-password");

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
      message: "Employees fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    email,
    role,
    name,
    profilePicture,
    gender,
    dateOfBirth,
    phoneNumber,
    salary,
    position,
    department,
    address,
    city
  } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being updated and if it's already taken
    if (email && email !== user.email) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.email = email || user.email;
    user.role = role || user.role;
    user.name = name || user.name;
    user.profilePicture = profilePicture || user.profilePicture;
    user.gender = gender || user.gender;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.salary = salary || user.salary;
    user.position = position || user.position;
    user.department = department || user.department;
    user.address = address || user.address;
    user.city = city || user.city;

    // Only update password if provided
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE EMPLOYEE
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




