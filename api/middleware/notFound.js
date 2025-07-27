const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      cities: '/api/v1/cities',
      prices: '/api/v1/prices',
      users: '/api/v1/users'
    }
  });
};

module.exports = notFound;
