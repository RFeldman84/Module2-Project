module.exports = (req, res, next) => {
  // in a moment when we log in, we set user object inside req.session
  // this makes it available in any route when you have the access to "req"
  // req.session ---> currentUser
  res.locals.userInSession = req.session.currentUser;

  next();
};
