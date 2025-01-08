import Department from "../models/Department.js";

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Get Departments Server Error ", err });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const newDepartment = new Department({
      dep_name,
      description,
    });
    await newDepartment.save();
    return res.status(200).json({ success: true, department: newDepartment });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Add Department Server Error ", err });
  }
};

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById({ _id: id });
    return res.status(200).json({ success: true, department });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Get Department Server Error ", err });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    // These are the updated values
    const { dep_name, description } = req.body;
    const updatedDep = await Department.findByIdAndUpdate(
      { _id: id },
      {
        dep_name,
        description,
      }
    );
    return res.status(200).json({ success: true, updatedDep });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Get Department Server Error ", err });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDep = await Department.findById({ _id: id });
    await deletedDep.deleteOne();
    return res.status(200).json({ success: true, deletedDep });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Get Department Server Error ", err });
  }
};

export {
  addDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
