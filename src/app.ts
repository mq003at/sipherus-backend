import mongoose from "mongoose";
import connectDb from "./config/db";
import dotenv from "dotenv";
import express from "express";
import employeeRoutes  from "./routes/employeeRoutes";
import attendanceRecordRoutes  from "./routes/attendanceRecordRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
connectDb();
mongoose.set('debug', true);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Backend of Sipherus Project');
});

// Defined routes
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance-records", attendanceRecordRoutes);

app.listen(port, () => {
    console.log(`Server is now running on http://localhost:${port}`);
});