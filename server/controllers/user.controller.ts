import express, { Express, Request, Response } from "express";
import userData from "../models/user.model";

const login = (req: Request, res: Response) => {
  // unwrap the data..
  // find the user
  // compare the password
  // if password is correct, return logged in
  // else return error

  console.log(req.body);
  // username fetch garne.. ani pw compare.. if all fine send cookies with {username: "abh1sh3k"}

  res.cookie("username", "abh1sh3k");
  res.send("Login Successful");
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("username").send("Log out was successful");
};

const getUserData = async (req: Request, res: Response) => {
  // get the user from the cookie
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

    console.log("user data i got is ", userdata);
    res.json(userdata);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.send("Failed to fetch user data");
    return;
  }
};

export default {
  login,
  logout,
  getUserData
};
