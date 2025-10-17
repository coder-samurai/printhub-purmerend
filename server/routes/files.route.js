// routes/files.route.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".stl" && ext !== ".obj") {
      return cb(new Error("Alleen .stl en .obj bestanden zijn toegestaan"));
    }
    cb(null, true);
  },
});

router.post("/", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: "Geen bestand geüpload" });
  }

  res.json({
    success: true,
    data: {
      filename: file.filename,
      sizeBytes: file.size,
      mimetype: file.mimetype,
    },
  });
});

export default router;