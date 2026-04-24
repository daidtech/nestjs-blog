import { Strategy as JwtStrategy } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

const prisma = new PrismaClient();

function cookieExtractor(req: Request): string | null {
  return (req && req.cookies) ? req.cookies.token : null;
}

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET as string,
  },
  async (payload: { sub: number }, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

export default jwtStrategy;
