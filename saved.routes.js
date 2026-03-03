import { Router } from "express";
import auth from "../middleware/auth.js";
import { getSaved, toggleSave, removeSaved } from "../controllers/saved.controller.js";

const r = Router();
r.use(auth);
r.get("/", getSaved);
r.post("/:itemId", toggleSave);
r.delete("/:itemId", removeSaved);
export default r;
