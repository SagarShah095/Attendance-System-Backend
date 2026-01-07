const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const departmentRoute = require("./routes/departmentRoute");
const leaveRoute = require("./routes/leaveRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/department", departmentRoute);
app.use("/api/leave", leaveRoute);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
