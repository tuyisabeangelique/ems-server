import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found when adding leave",
      });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    // Save into mongoDB
    await newLeave.save();

    return res
      .status(200)
      .json({ success: true, message: "New leave created" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Server Error when adding new leave" });
  }
};

const getEmpLeaveById = async (req, res) => {
  try {
    const { id, role } = req.params;
    let leaves;
    if (role === "admin") {
      leaves = await Leave.find({ employeeId: id });
    } else {
      const employee = await Employee.findOne({ userId: id });

      leaves = await Leave.find({ employeeId: employee._id });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved leaves of employee",
      leaves,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error when getting emp leave by id",
    });
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        { path: "department", select: "dep_name" },
        { path: "userId", select: "name" },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved leaves",
      leaves,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error when getting leaves",
    });
  }
};

const getLeave = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const leave = await Leave.findById({ _id: id }).populate({
      path: "employeeId",
      populate: [
        { path: "department", select: "dep_name" },
        { path: "userId", select: "name profileImage" },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved leave",
      leave,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error when getting leave",
    });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByIdAndUpdate(
      { _id: id },
      { status: req.body.status }
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        error: "Leave not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully updated leave",
      leave,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error when updating leave",
    });
  }
};

export { addLeave, getEmpLeaveById, getLeaves, getLeave, updateLeave };
