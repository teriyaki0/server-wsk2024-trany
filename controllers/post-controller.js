import db from "../db/mysql.js";

import { v4 } from "uuid";

export const createPost = async (req, res) => {
  const { title, description, postImage } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "we need you to enter title and description",
    });
  }

  const id = v4();
  const userId = req.userId;

  await db.query(
    "INSERT INTO `posts`(`id`, `title`, `description`, `userId`, `postImage`) VALUES (?, ?, ?, ?, ?)",
    [id, title, description, userId, postImage ? postImage : ""]
  );

  return res.status(200).json({
    success: true,
    id: id,
    title: title,
    description: description,
    postImage: postImage,
  });
};

export const updatePost = async (req, res) => {
  const { title, description, postImage } = req.body;
  const { id } = req.params;

  const userId = req.userId;

  const post = await db.query("SELECT * FROM `posts` WHERE `id` = ?", [id]);

  if (userId != post[0][0].userId) {
    return res.status(400).json({
      message: "You can't update this post",
    });
  }

  if (!title || !description) {
    return res.status(400).json({
      message: "we need you to enter title and description",
    });
  }

  await db.query(
    "UPDATE `posts` SET `title`=?,`description`=?, `postImage`= ? WHERE `id`= ?",
    [title, description, postImage ? postImage : "", id]
  );

  return res.status(200).json({
    success: true,
    id: id,
    title: title,
    description: description,
  });
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const post = await db.query("SELECT * FROM `posts` WHERE `id` = ?", [id]);

  if (userId != post[0][0].userId) {
    return res.status(400).json({
      message: "You can't update this post",
    });
  }

  await db.query("DELETE FROM `posts` WHERE `id` = ?", [id]);

  return res.status(200).json({
    success: true,
  });
};

export const getAll = async (req, res) => {
  const posts = await db.query("SELECT * FROM `posts`");

  return res.status(200).json({
    posts: posts[0],
    success: true,
  });
};

export const getOne = async (req, res) => {
  const { id } = req.params;
  const post = await db.query("SELECT * FROM `posts` WHERE `id` = ?", [id]);

  return res.status(200).json({
    post: post[0],
    success: true,
  });
};
