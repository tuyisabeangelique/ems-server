// We are allowed to import this way because we added type: module in index.js
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import connectToDatabase from "./db/db.js";
import departmentRouter from "./routes/department.js";
import employeeRouter from "./routes/employee.js";
import salaryRouter from "./routes/salary.js";
import leaveRouter from "./routes/leaves.js";
import settingsRouter from "./routes/settings.js";
import dashboardRouter from "./routes/dashboard.js";

connectToDatabase();
const app = express();
const corsOrigin = {
  origin: "https://ems-frontend-angelique-tuyisabes-projects.vercel.app",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOrigin));

// app.use(
//   cors({
//     origin: "https://ems-frontend-angelique-tuyisabes-projects.vercel.app",
//     methods: "GET,POST,PUT,DELETE",
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(express.json());
// Allows us to access the public folder from the frontend
app.use(express.static("public/uploads"));
app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/dashboard", dashboardRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
