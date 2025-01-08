import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
// import mongoose from "mongoose";
import Department from "../models/Department.js";

const getEmployees = async (req, res) => {
  // Fetch the employees data from database
  try {
    // When returning this data, populate the userId and dept fields so we can access it later on. Also, we dont want to return the password
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employees });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server error when getting employees",
      err,
    });
  }
};

const getEmployee = async (req, res) => {
  try {
    let employee;
    const { id } = req.params;
    employee = await Employee.findById({ _id: id })
      .populate("userId", { password: 0 })
      .populate("department");
    if (!employee) {
      // This means we may have passed the userId and must now check by employeeId
      employee = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }
    return res.status(200).json({ success: true, employee });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server error when getting an employee",
      err,
    });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;

    // Register a User unless they already exist
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "User is already registered." });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });

    console.log("newUser Body:", newUser);

    const savedUser = await newUser.save();

    const dep = await Department.findById(department);

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      dep_name: dep.dep_name,
    });

    await newEmployee.save();
    return res.status(200).json({ success: true, message: "Employee created" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Server Error when adding employee" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, maritalStatus, designation, department, salary } =
      req.body;

    const employee = await Employee.findById(id);

    if (!employee) {
      res.status(500).json({
        success: false,
        error: "Employee not found when updating",
        err,
      });
    }

    const user = await User.findById(employee.userId);

    if (!user) {
      res
        .status(500)
        .json({ success: false, error: "User not found when updating", err });
    }

    const updatedUser = await User.findByIdAndUpdate(
      employee.userId,
      {
        name,
      },
      { new: true }
    );

    const fullDepartment = await Department.findById(department);

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        dep_name: fullDepartment.dep_name,
        department,
        gender,
        designation,
        maritalStatus,
        salary,
      },
      { new: true }
    );

    if (!updatedEmployee || !updatedUser) {
      return res
        .status(500)
        .json({ success: false, error: "Document not found", err });
    }

    return res.status(200).json({
      success: true,
      message: "Employee successfully updated.",
      updatedEmployee,
      updatedUser,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Update employee server error ", err });
  }
};

const getEmployeesByDept = async (req, res) => {
  try {
    const { id } = req.params;
    const employees = await Employee.find({ department: id });
    return res.status(200).json({ success: true, employees });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server error when getting employees by dept id",
      err,
    });
  }
};

export {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  getEmployeesByDept,
};
