import { Router } from "express";
import auth from "../middleware/auth.js";
import { listCategories, listItems, getItem, createItem, refreshImages } from "../controllers/items.controller.js";

const r = Router();

r.get("/categories", listCategories);
r.get("/", listItems);
r.get("/:id", getItem);

// Create item requires auth
r.post("/", auth, createItem);

// Admin-only: refresh images for all or a specific category (?category=veg|non-veg|seafood|chinese)
r.post("/refresh-images", auth, refreshImages);

export default r;
