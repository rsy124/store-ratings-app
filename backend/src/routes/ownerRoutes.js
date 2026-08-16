const express = require("express");
const prisma = require("../utils/prismaClient");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate, authorize("STORE_OWNER"));

// GET /api/owner/dashboard — raters list + average rating for the logged-in owner's store
router.get("/dashboard", async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { ownerId: req.user.id },
    include: {
      ratings: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!store) {
    return res.status(404).json({ error: "No store linked to this account" });
  }

  const average = store.ratings.length
    ? (store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length).toFixed(2)
    : null;

  res.json({
    storeName: store.name,
    averageRating: average,
    raters: store.ratings.map((r) => ({
      userId: r.user.id,
      name: r.user.name,
      email: r.user.email,
      rating: r.value,
    })),
  });
});

module.exports = router;