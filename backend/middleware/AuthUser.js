import User from "../modules/UserModule.js";


//this logic is for normal user login 
export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      msg: "User unauthorized!",
    });
  }
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });

  if (!user) return res.status(404).json({ msg: "Problem ocurred!" });
  req.userId = user.id;
  req.role = user.role;
  next();
};


// logic  for admin login
export const adminOnly = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });

  if (!user) return res.status(404).json({ msg: "Problem ocurred!" });
  if (user.role !== "admin")
    return res.status(403).json({
      msg: "User is not Admin!",
    });
  next();
};
