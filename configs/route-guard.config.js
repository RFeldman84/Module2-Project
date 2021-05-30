module.exports = (req, res, next) => {
  // if user is logged in (authenticated), allow user to see a specific page
  if (req.session.currentUser) next();
  // in any other case, prompt user to login first and then allow them to see the page
  else res.redirect("/auth/login");
  //**** */
  //else res.redirect("/"); // change when put login on home
};
