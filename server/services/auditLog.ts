import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

type ActionType = "CREATE" | "UPDATE" | "DELETE" | "READ" | "LOGIN" | "LOGOUT";
type LogType = "ERROR" | "INFO";

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
  user: string,
  module: string,
  message: string
) => {
  const logMessage = `${actionType} action in ${module} by ${user}: ${message}`;
  auditLogger.log({
    level: logType.toLowerCase(),
    message: logMessage,
  });
};
