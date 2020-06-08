function requireUser(req, res, next) {
  if (!req.user) {
    next({
      name: "Not logged in",
      message: "Log in to do this",
    });
  }
  t();
}

module.exports = {
  requireUser,
};
