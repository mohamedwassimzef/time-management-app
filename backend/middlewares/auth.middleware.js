import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    //read the token from the header
    const authHeader = req.headers.authorization;

    //check if token exists and is in the correct format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    // Verify token and return user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    console.log("🔐 User authenticated:", decoded);
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
