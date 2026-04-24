import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

// Redirect to login if not authenticated
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.redirect('/auth/login');
    return;
  }
  next();
}

// Require a specific role (e.g. 'admin')
function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.redirect('/auth/login');
      return;
    }
    if ((req.user as unknown as { role: string }).role !== role) {
      next(createError(403, 'Forbidden'));
      return;
    }
    next();
  };
}

export { requireAuth, requireRole };
