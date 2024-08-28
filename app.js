import express from "express";
import multer from "multer";
import cors from "cors";

import {
  getMe,
  getUser,
  login,
  register,
} from "./controllers/user-controller.js";

import {
  createPost,
  deletePost,
  getAll,
  getOne,
  updatePost,
} from "./controllers/post-controller.js";

import authCheck from "./middlewares/auth-check.js";

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, __filename, cb) => {
    cb(null, __filename.originalname);
  },
});

const uploads = multer({ storage });

const main = async () => {
  app.use(express.json());
  app.use(cors());

  app.use("/upload", express.static("uploads"));

  app.post("/upload", authCheck, uploads.single("image"), (req, res) => {
    return res.json({
      url: `upload/${req.file.originalname}`,
    });
  });

  app.post("/auth/login", login);
  app.post("/auth/register", register);
  app.get("/auth/me", authCheck, getMe);
  app.get("/auth/:id", getUser);

  app.get("/posts", getAll);
  app.get("/posts/:id", getOne);
  app.post("/posts", authCheck, createPost);
  app.put("/posts/:id", authCheck, updatePost);
  app.delete("/posts/:id", authCheck, deletePost);

  app.listen(process.env.PORT || 4200, () => {
    console.log("RUN 4200");
  });
};

main();
