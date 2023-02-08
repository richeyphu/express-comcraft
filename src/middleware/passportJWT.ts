import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback,
} from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';

import { env } from '@config';
import { User, IUser } from '@models';

interface IJwtPayload extends JwtPayload {
  id: string;
}

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET,
  // issuer: "accounts.examplesoft.com";
  // audience: "yoursite.net";
};

passport.use(
  new JwtStrategy(
    opts,
    async (jwt_payload: IJwtPayload, done: VerifiedCallback) => {
      try {
        const user: IUser | null = await User.findById(jwt_payload.id);

        if (!user) {
          return done(new Error('ไม่พบผู้ใช้งาน'), false);
        }

        return done(null, user);
      } catch (error: unknown) {
        done(error);
      }
    }
  )
);

const isLogin: unknown = passport.authenticate('jwt', { session: false });

export default isLogin;
