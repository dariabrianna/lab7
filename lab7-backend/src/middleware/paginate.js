module.exports = (req, res, next) => {
    const { skip = 0, limit = 20 } = req.query;
    req.pagination = { skip: +skip, take: +limit };
    next();
  };
  