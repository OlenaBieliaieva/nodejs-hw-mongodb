export const notFoundHandler = (req, res, next) => {
  res.starus(404).json({
    status: 404,
    message: 'Route not found',
  });
  next();
};
