import { Router } from "express";
import auth from "../middleware/auth.js";
import { myOrders, createFromCart, adminList, approve, reject } from "../controllers/orders.controller.js";

const r = Router();
r.use(auth);

// Customer routes
r.get("/my", myOrders);
r.post("/from-cart", createFromCart);

// Admin routes
r.get("/admin", adminList);
r.post("/:id/approve", approve);
r.post("/:id/reject", reject);

export default r;
