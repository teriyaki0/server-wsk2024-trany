import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const headers = req.headers.authorization || "";
  const token = headers.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Not Auth" });
  } else {
    try {
      const decoded = jwt.verify(token, "secret");
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Not Auth" });
    }
  }
};
