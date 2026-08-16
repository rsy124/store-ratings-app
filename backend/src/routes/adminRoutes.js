const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../utils/prismaClient");
const { signupSchema } = require("../utils/validators");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// All routes here require a logged-in ADMIN
router.use(authenticate, authorize("ADMIN"));

// POST /api/admin/users — create a normal or admin user
router.post("/users", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const { name, email, address, password } = parsed.data;
  const role = req.body.role === "ADMIN" ? "ADMIN" : "NORMAL_USER";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, address, password: hashed, role },
  });

  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// POST /api/admin/stores — create a store, optionally with a new store owner
router.post("/stores", async (req, res) => {
  const { name, email, address, owner } = req.body;

  if (!name || !email || !address) {
    return res.status(400).json({ error: "name, email, and address are required" });
  }

  let ownerId = null;

  if (owner) {
    const parsed = signupSchema.safeParse(owner);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const existing = await prisma.user.findUnique({ where: { email: owner.email } });
    if (existing) return res.status(409).json({ error: "Owner email already in use" });

    const hashed = await bcrypt.hash(owner.password, 10);
    const ownerUser = await prisma.user.create({
      data: {
        name: owner.name,
        email: owner.email,
        address: owner.address,
        password: hashed,
        role: "STORE_OWNER",
      },
    });
    ownerId = ownerUser.id;
  }

  const store = await prisma.store.create({
    data: { name, email, address, ownerId },
  });

  res.status(201).json(store);
});

// GET /api/admin/dashboard — counts
router.get("/dashboard", async (req, res) => {
  const [userCount, storeCount, ratingCount] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  res.json({ users: userCount, stores: storeCount, ratings: ratingCount });
});

// GET /api/admin/users — list, filter by name/email/address/role, sortable
router.get("/users", async (req, res) => {
  const { name, email, address, role, sortBy = "name", order = "asc" } = req.query;

  const where = {
    ...(name && { name: { contains: name, mode: "insensitive" } }),
    ...(email && { email: { contains: email, mode: "insensitive" } }),
    ...(address && { address: { contains: address, mode: "insensitive" } }),
    ...(role && { role }),
  };

  const users = await prisma.user.findMany({
    where,
    orderBy: { [sortBy]: order },
    select: { id: true, name: true, email: true, address: true, role: true },
  });

  res.json(users);
});

// GET /api/admin/stores — list, filter, sortable, with average rating
router.get("/stores", async (req, res) => {
  const { name, email, address, sortBy = "name", order = "asc" } = req.query;

  const where = {
    ...(name && { name: { contains: name, mode: "insensitive" } }),
    ...(email && { email: { contains: email, mode: "insensitive" } }),
    ...(address && { address: { contains: address, mode: "insensitive" } }),
  };

  const stores = await prisma.store.findMany({
    where,
    orderBy: { [sortBy]: order },
    include: { ratings: true },
  });

  const result = stores.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    address: s.address,
    rating: s.ratings.length
      ? (s.ratings.reduce((sum, r) => sum + r.value, 0) / s.ratings.length).toFixed(2)
      : null,
  }));

  res.json(result);
});

// GET /api/admin/users/:id — user detail (+ rating if store owner)
router.get("/users/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    include: { store: { include: { ratings: true } } },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  const response = {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
  };

  if (user.role === "STORE_OWNER" && user.store) {
    const ratings = user.store.ratings;
    response.rating = ratings.length
      ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(2)
      : null;
  }

  res.json(response);
});

module.exports = router;