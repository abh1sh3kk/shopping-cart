import winston from "winston";

import DailyRotateFile from "winston-daily-rotate-file";
// import AuditLog from "./../models/audit.model";

type ActionType = "CREATE" | "UPDATE" | "DELETE" | "READ";
type LogType = "ERROR" | "INFO";
type ModuleType = string;
type UserType = string;

export const auditLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new DailyRotateFile({
      filename: "audit-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      dirname: "./logs/audit",
      maxFiles: "7d",
    }),
    new winston.transports.Console(),
  ],
});

export const auditLog = (
  actionType: ActionType,
  logType: LogType,
  user: UserType,
  module: ModuleType,
  message: string
) => {
  const logMessage = `${actionType} action in ${module} by ${user}: ${message}`;
  auditLogger.log({
    level: logType.toLowerCase(),
    message: logMessage,
  });

  // to store in db
  // const newAuditLog = new AuditLog({
  //   actionType,
  //   logType,
  //   user,
  //   module,
  //   message,
  // });

  // try {
  //   await newAuditLog.save();
  //   console.log("Audit log saved to DB");
  // } catch (error) {
  //   console.error("Error saving audit log to DB:", error);
  // }
};
