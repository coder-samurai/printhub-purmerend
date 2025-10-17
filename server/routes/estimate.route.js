// routes/estimate.route.js
import { Router } from "express";
const router = Router();

router.post("/", (req, res) => {
  const { sizeBytes, material = "PLA", quality = "standard" } = req.body || {};
  const numericSize = Number(sizeBytes);

  if (!numericSize || Number.isNaN(numericSize)) {
    return res.status(400).json({
      success: false,
      message: "Ongeldige of ontbrekende 'sizeBytes' in de aanvraag",
    });
  }

  const qualityFactor = { draft: 0.8, standard: 1.0, fine: 1.5 }[quality] || 1.0;
  const materialRates = {
    PLA: { density: 1.24, costPerGram: 0.03 },
    PETG: { density: 1.27, costPerGram: 0.035 },
    ABS: { density: 1.04, costPerGram: 0.04 },
  };
  const mat = materialRates[material] || materialRates.PLA;

  const volumeCm3 = Math.min(numericSize / 1000, 1000);
  const weightGrams = volumeCm3 * mat.density;
  const materialCost = weightGrams * mat.costPerGram;

  const printSpeedCm3PerHour = 12 * (1 / qualityFactor);
  const estHours = volumeCm3 / printSpeedCm3PerHour;
  const estTime = estHours * 60;

  const basePrice = 2.5;
  const timeCost = estHours * 5.5;
  const total = Math.round((basePrice + timeCost + materialCost) * 100) / 100;

  res.json({
    success: true,
    data: {
      timeMinutes: Math.round(estTime),
      priceEur: total,
      breakdown: { basePrice, timeCost, materialCost },
      used: { material, quality },
    },
  });
});

export default router;
