import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import UserModel from "../models/user.model.js";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new Strategy(options, async (jwtPayload, done) => {
    try {
      const user = await UserModel().getById(jwtPayload.id);
      if (!user) {
        return done(null, false);
      }

      delete user.password;
      delete user.createdat;
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);
