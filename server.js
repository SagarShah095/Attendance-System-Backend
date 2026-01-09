const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const departmentRoute = require("./routes/departmentRoute");
const leaveRoute = require("./routes/leaveRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const taskRoutes = require("./routes/taskRoutes"); // 👈 ADD THIS

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/department", departmentRoute);
app.use("/api/leave", leaveRoute);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/task", taskRoutes); // 👈 ADD THIS

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// ======================
// SOCKET.IO SETUP
// ======================

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store online users
const onlineUsers = {}; // { userId: socketId }

// Socket connection
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Join event (after login)
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("User joined:", userId);
  });

  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});

// Make io accessible in controllers
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// ======================
// START SERVER
// ======================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
