import db from "../db/mysql.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { v4 } from "uuid";

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const __avatarImage = req.body.avatarImage
      ? req.body.avatarImage
      : "default-avatar.png";

    if (!username || !password || !email) {
      return res.status(404).json({
        message: "Not Found data",
      });
    }

    const user = await db.query(
      "SELECT * FROM `users` WHERE `username` = ? OR `email` = ?",
      [username, email]
    );

    if (user[0].length > 0) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    const id = v4();
    const hashPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO `users`(`id`, `username`, `password`, `email`, `avatarImage`) VALUES (?, ?, ?, ?, ?)",
      [id, username, hashPassword, email, __avatarImage]
    );

    const token = jwt.sign(
      {
        id: id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );

    res.json({ success: true, token: token });
  } catch (error) {
    console.log("Error ", error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        message: "Not Found data",
      });
    }
    const user = await db.query("SELECT * FROM `users` WHERE `email` = ?", [
      email,
    ]);
    if (user[0].length === 0) {
      return res.status(404).json({
        message: "Not Found user",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user[0][0].password);

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Incorrect password or email",
      });
    }

    const token = jwt.sign(
      {
        id: user[0][0].id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );

    res.json({ success: true, token: token });
  } catch (error) {
    console.log("Error ", error);
  }
};

export const getMe = async (req, res) => {
  const userId = req.userId;

  const user = await db.query("SELECT * FROM `users` WHERE `id` = ?", [userId]);

  return res.status(200).json({
    user: user[0],
    success: true,
  });
};

export const getUser = async (req, res) => {
  const {id} = req.params;

  const user = await db.query("SELECT * FROM `users` WHERE `id` = ?", [id]);

  return res.status(200).json({
    user: user[0],
    success: true,
  });
};
