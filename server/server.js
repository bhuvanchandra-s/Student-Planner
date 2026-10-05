import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Student Planner API is running" });
});

app.get("/api", (req, res) => {
  res.json({
    name: "Student Planner API",
    version: "1.0.0",
    status: "development"
  });
});

app.listen(PORT, () => {
  console.log(`Student Planner API running on http://localhost:${PORT}`);
});
