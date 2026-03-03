import { Router } from "express";
import authRoutes from "./auth.routes.js";
import itemRoutes from "./items.routes.js";
import cartRoutes from "./cart.routes.js";
import savedRoutes from "./saved.routes.js";
import ordersRoutes from "./orders.routes.js";
import paymentsRoutes from "./payments.routes.js";

const router = Router();
router.get("/health", (req, res) => res.json({ ok: true }));
router.use("/auth", authRoutes);
router.use("/items", itemRoutes);
router.use("/cart", cartRoutes);
router.use("/saved", savedRoutes);
router.use("/orders", ordersRoutes);
router.use("/payments", paymentsRoutes);

export default router;
