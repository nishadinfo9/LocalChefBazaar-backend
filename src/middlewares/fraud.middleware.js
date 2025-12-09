export const checkFraud = async (req, res, next) => {
  if (req.user.status === "fraud") {
    return res.status(403).json({ message: "You account has banned" });
  }
  next();
};
