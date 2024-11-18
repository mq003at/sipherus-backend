import crypto from "crypto";

export const generateQRSecret = (employeeId: string): string => {
    const baseSecret = process.env.QRSECRET || "placeholder";
    const hash = crypto.createHmac("sha256", baseSecret).update(employeeId).digest("hex");
    return hash;
  };