import { Router } from "express";
import auth from "../middleware/auth.js";
import { getCart, addToCart, removeFromCart } from "../controllers/cart.controller.js";

const r = Router();
r.use(auth);
r.get("/", getCart);
r.post("/", addToCart);
r.delete("/:itemId", removeFromCart);
export default r;
