import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import  UserModel  from '../models/user.model.js';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new Strategy(options, async function (jwt_payload, done) {
    try {
      const user = await UserModel().getById(jwt_payload.id);
      delete user.password;
      delete user.createdat;
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (e) {
      return done(e);
    }
  })
);