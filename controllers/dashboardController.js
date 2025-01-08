import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const getSummary = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();

    const sumOfSalaries = await Employee.aggregate([
      // find the sum of all salaries and store in totalSalary var
      { $group: { _id: null, totalSalary: { $sum: "$salary" } } },
    ]);

    const totalEmpsWithLeavesApplied = await Leave.distinct("employeeId");

    const leaveStatus = await Leave.aggregate([
      // Group leaves by status.
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const leaveSummary = {
      appliedFor: totalEmpsWithLeavesApplied.length,
      approved: leaveStatus.find((item) => item._id === "Approved")?.count || 0,
      pending: leaveStatus.find((item) => item._id === "Pending")?.count || 0,
      rejected: leaveStatus.find((item) => item._id === "Rejected")?.count || 0,
    };

    return res.status(200).json({
      success: true,
      totalDepartments,
      totalEmployees,
      totalSalary: sumOfSalaries[0]?.totalSalary,
      leaveSummary,
      appliedFor: leaveSummary.appliedFor,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Server error with dashboard summary" });
  }
};

export { getSummary };
