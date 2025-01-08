import Employee from "../models/Employee.js";
import Salary from "../models/Salary.js";

const addSalary = async (req, res) => {
  try {
    const { employeeId, salary, allowances, deductions, payDate } = req.body;

    //  Get net salary
    const netSalary =
      parseInt(salary) + parseInt(allowances) - parseInt(deductions);

    const newSalary = new Salary({
      employeeId,
      salary,
      allowances,
      deductions,
      netSalary,
      payDate,
    });

    // Save into mongoDB
    await newSalary.save();

    return res
      .status(200)
      .json({ success: true, message: "New salary created" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Server Error when adding new salary" });
  }
};

const getSalary = async (req, res) => {
  try {
    const { id, role } = req.params;

    let salary;
    if (role === "admin") {
      salary = await Salary.find({ employeeId: id }).populate(
        "employeeId",
        "employeeId"
      );
    } else {
      const employee = await Employee.findOne({ userId: id });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found for the given userId",
        });
      }

      salary = await Salary.find({ employeeId: employee._id }).populate(
        "employeeId",
        "employeeId"
      );
    }

    return res
      .status(200)
      .json({ success: true, message: "Success getting salary", salary });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Server Error when getting salary" });
  }
};

export { addSalary, getSalary };
