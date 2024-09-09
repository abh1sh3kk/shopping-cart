import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  datetime: { type: Date, default: Date.now },
  actionType: { type: String, required: true },
  logType: { type: String, required: true },
  user: { type: String, required: true },
  module: { type: String, required: true },
  message: { type: String, required: true },
});

const AuditLog = mongoose.model("AuditLog", auditSchema);

export default AuditLog;
