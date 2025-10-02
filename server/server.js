import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import config from "./config/env.js";
import adminRoutes from "./routes/admin/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

connectDB();
const app = express();
app.use(express.json());

// allow frontend origin
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = config.port;
app.listen(PORT, () =>
  console.log(`Server running on: http://localhost:${PORT}`)
);
