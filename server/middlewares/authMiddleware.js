// backend/src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
// import Guide from "../models/guide.js";

// ✅ Protect Admin
export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// ✅ Protect Guide
export const protectGuide = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.guide = await Guide.findById(decoded.id).select("-password");
      if (!req.guide) throw new Error();

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized as guide" });
    }
  }

  res.status(401).json({ message: "No token, authorization denied" });
};
