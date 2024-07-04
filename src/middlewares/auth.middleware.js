import passport from "passport";

const pathsNoAuth = [
  {
    path: "/auth/login",
    method: "POST",
  },
  {
    path: "/users",
    method: "POST",
  },
];

const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user; // Establece el usuario autenticado en la solicitud
    return next();
  })(req, res, next);
};

const applyJWTAuthentication = (req, res, next) => {
  if (
    pathsNoAuth.some(
      (element) => element.path === req.path && element.method === req.method
    )
  ) {
    return next();
  }
  authenticateJWT(req, res, next);
};

export default applyJWTAuthentication;
