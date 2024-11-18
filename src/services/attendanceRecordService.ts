import { BaseService } from "./baseService";
import AttendanceRecord , { IAttendanceRecord } from "../models/attendanceRecord";
import  Employee  from "../models/employee";

export class AttendanceRecordService extends BaseService<IAttendanceRecord> {
  constructor() {
    super(AttendanceRecord); // Pass the AttendanceRecord model to BaseService
  }

  // Override create
  async create(data: Partial<IAttendanceRecord>): Promise<IAttendanceRecord> {
    const attendanceRecord = await this.model.create(data);

    // Update the employee's current status and last status update
    await Employee.findByIdAndUpdate(
      attendanceRecord.employeeId,
      {
        currentStatus: attendanceRecord.status,
        lastStatusUpdate: new Date(),
      },
      { new: true }
    );

    return attendanceRecord;
  }
}
