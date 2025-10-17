import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import healthRoute from "./routes/health.route.js";
import filesRoute from "./routes/files.route.js";
import estimateRoute from "./routes/estimate.route.js";

const app = express();

const PORT = process.env.PORT || env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("PrintHub Server draait!");
});

app.use("/api/health", healthRoute);
app.use("/api/files", filesRoute);
app.use("/api/estimate", estimateRoute);

app.use('/uploads', express.static('./uploads'));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});

