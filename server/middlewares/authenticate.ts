import { Request, Response, NextFunction } from "express";
import userData from "../models/user.model";

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const username = req.cookies?.username;

  if (!username) {
    return res.status(401).end();
  }

  try {
    const user = await userData.findOne({ username });

    if (!user) return res.status(401).end();

    console.log("User found in the database. Proceeding to the next middleware.");
    next();
  } catch (err) {
    console.error("Error during authentication:", err);
    res.status(500).end();
  }
}
