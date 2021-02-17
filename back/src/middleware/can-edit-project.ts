export default async (req, res, next) => {
  const { id: projectId } = req.params;
  const { userId } = res.locals.user;
  next();
};
