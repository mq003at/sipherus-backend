import { BaseService } from "./baseService";
import Employee, { IEmployee } from "../models/employee";
import { generateQRSecret } from "../utils/qrSecret";
import { RealTimeStatus } from "../types/RealTimeStatus";
import AttendanceRecord from "../models/attendanceRecord";

export class EmployeeService extends BaseService<IEmployee> {
  constructor() {
    super(Employee); 
  }

    // QR validation. Doesnt have controller
    async validateQRSecret(employeeId: string, qrSecret: string): Promise<boolean> {
      const employee = await this.model.findById(employeeId).select("qrSecret").exec();
      if (!employee) throw("Can't find employee");
      return employee.qrSecret === qrSecret;
    }

  // Retrieve all employees with selected fields only
  async getMinimalEmployeeData(): Promise<Partial<IEmployee>[]> {
    const employees = await this.model
      .find({}, "employeeId name currentStatus lastStatusUpdate")
      .exec();
    console.log("Queried employees:", employees); 
    return employees;
  }

  // Overiding employee create
  async create(data: Partial<IEmployee>): Promise<IEmployee> {
    if (!data.employeeId) {
      throw new Error("Employee ID is required");
    }
    data.qrSecret = generateQRSecret(data.employeeId);
    return await this.create(data);
  }

  async toggleAttendanceStatus(employeeId: string, qrSecret: string): Promise<IEmployee> {
    const isValid = await this.validateQRSecret(employeeId, qrSecret);

    if (!isValid) {
      throw new Error("Authorization failed: Invalid QR Secret.");
    }

    const employee = await this.model.findById(employeeId);

    if (!employee) {
      throw new Error("Employee not found");
    }

    const newStatus =
      employee.currentStatus === RealTimeStatus.PRESENT
        ? RealTimeStatus.ABSENT
        : RealTimeStatus.PRESENT;

    employee.currentStatus = newStatus;
    employee.lastStatusUpdate = new Date();
    await employee.save();

    await AttendanceRecord.create({
      employeeId: employee._id,
      status: newStatus,
    });

    return employee;
  }
}
