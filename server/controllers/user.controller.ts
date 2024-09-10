import express, { Express, Request, Response } from "express";
import userData from "../models/user.model";
import { auditLog } from "../services/auditLog";

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required.");
    }

    const user = await userData.findOne({ username, password });

    if (user) {
      res.cookie("username", username, { httpOnly: true, secure: true });
      auditLog("LOGIN", "INFO", username, "User Module", "User is logged in");
      return res.status(200).send("Login successful");
    }

    res.status(401).send("Login unsuccessful");
  } catch (err) {
    console.error("Error in logging in:", err);
    res.status(500).send("Internal server error");
  }
};

const health = (req: Request, res: Response) => {
  res.send("Welcome to the shopping cart");
};

const logout = (req: Request, res: Response) => {
  if (req.cookies?.username)
    auditLog(
      "LOGOUT",
      "INFO",
      req.cookies?.username,
      "User Module",
      "User is logged out"
    );
  res.clearCookie("username").send("Log out was successful");
};

const getUserData = async (req: Request, res: Response) => {
  const username = req.cookies?.username;
  if (!username) {
    res.send("Login not successful, please try again");
    return;
  }

  try {
    const userdata = await userData.findOne(
      { username: username },
      { id: 1, username: 1, carts: 1, history: 1 }
    );

    if (!userdata) {
      res.status(404).send("User not found");
      return;
    }
    auditLog("READ", "INFO", username, "Product Module", "Users data fetched.");
    res.json(userdata);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.send("Failed to fetch user data");
    return;
  }
};

const addUser = async (req: Request, res: Response) => {
  const user = req.body;
  try {
    const replaced = await userData.findOneAndReplace({ username: user.username }, user, {
      upsert: true,
    });
    // @ts-ignore
    if (replaced?.lastErrorObject?.updatedExisting) {
      res.status(200).send("User updated successfully");
    } else {
      res.status(201).send("New user added successfully");
    }
  } catch (err) {
    console.error("Error adding/updating user:", err);
    res
      .status(500)
      .send("An error occurred while adding/updating the user, check the console");
  }
};

export default {
  health,
  login,
  logout,
  getUserData,
  addUser,
};
