import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  getEmployeesByDept,
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", authMiddleware, getEmployees);
router.get("/:id", authMiddleware, getEmployee);
router.get("/department/:id", authMiddleware, getEmployeesByDept);
router.post("/add", authMiddleware, upload.single("image"), addEmployee);
router.put("/:id", authMiddleware, updateEmployee);

// router.delete("/:id", authMiddleware, deleteEmployee);

export default router;
