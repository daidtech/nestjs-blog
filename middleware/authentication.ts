import { Request, Response, NextFunction } from 'express';
import passport from '../src/auth/passport';
import { User } from '@prisma/client';

// Silently attach req.user from JWT cookie on every request.
// If no token or invalid token, req.user stays undefined — no error, no redirect.
function attachUserFromJWT(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: User | false) => {
    if (err) return next(err);
    if (user) req.user = user;
    next();
  })(req, res, next);
}

export default attachUserFromJWT;
