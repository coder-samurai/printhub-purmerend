// routes/health.route.js
import { Router } from "express";
const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      message: "PrintHub Purmerend API werkt!",
    },
  });
});

export default router;
