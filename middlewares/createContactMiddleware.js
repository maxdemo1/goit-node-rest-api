export const createContactMiddleware = async (req, res, next) => {
  req.body.owner = req.user.id;
  next();
};
