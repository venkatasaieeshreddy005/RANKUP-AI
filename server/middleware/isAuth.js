const jwt = require("jsonwebtoken");

module.exports.isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verifyToken.userId;

    next();
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Authentication error",
      error: error.message,
    });
  }
};