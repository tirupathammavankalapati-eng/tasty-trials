import { Router } from "express";
import auth from "../middleware/auth.js";
import { confirmPayment } from "../controllers/payments.controller.js";

const r = Router();
r.use(auth);
r.post("/confirm", confirmPayment);
export default r;
