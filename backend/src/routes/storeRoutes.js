const express = require("express");
const prisma = require("../utils/prismaClient");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/stores — list stores + user's own rating, search by name/address
router.get("/", authenticate, authorize("NORMAL_USER"), async (req, res) => {
  const { name, address } = req.query;

  const where = {
    ...(name && { name: { contains: name, mode: "insensitive" } }),
    ...(address && { address: { contains: address, mode: "insensitive" } }),
  };

  const stores = await prisma.store.findMany({
    where,
    include: { ratings: true },
  });

  const result = stores.map((s) => {
    const overall = s.ratings.length
      ? (s.ratings.reduce((sum, r) => sum + r.value, 0) / s.ratings.length).toFixed(2)
      : null;

    const userRating = s.ratings.find((r) => r.userId === req.user.id);

    return {
      id: s.id,
      name: s.name,
      address: s.address,
      overallRating: overall,
      userRating: userRating ? userRating.value : null,
    };
  });

  res.json(result);
});

// POST /api/stores/:id/ratings — submit or modify a rating
router.post("/:id/ratings", authenticate, authorize("NORMAL_USER"), async (req, res) => {
  const storeId = Number(req.params.id);
  const { value } = req.body;

  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return res.status(400).json({ error: "Rating must be an integer 1-5" });
  }

  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) return res.status(404).json({ error: "Store not found" });

  const rating = await prisma.rating.upsert({
    where: { userId_storeId: { userId: req.user.id, storeId } },
    update: { value },
    create: { value, userId: req.user.id, storeId },
  });

  res.json(rating);
});

module.exports = router;