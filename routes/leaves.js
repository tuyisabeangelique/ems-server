import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addLeave,
  getEmpLeaveById,
  getLeaves,
  getLeave,
  updateLeave,
} from "../controllers/leaveController.js";

const router = express.Router();

router.post("/add", authMiddleware, addLeave);
router.get("/one-leave/:id", authMiddleware, getLeave);
router.get("/:id/:role", authMiddleware, getEmpLeaveById);
router.get("/", authMiddleware, getLeaves);
router.put("/:id", authMiddleware, updateLeave);

export default router;
