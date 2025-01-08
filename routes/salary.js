import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addSalary, getSalary } from "../controllers/salaryController.js";

const router = express.Router();

router.get("/:id/:role", authMiddleware, getSalary);
router.post("/add", authMiddleware, addSalary);

export default router;
