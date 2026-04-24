import { Request, Response, NextFunction } from 'express';

function logger(req: Request, _res: Response, next: NextFunction): void {
  console.log('--- Logger Middleware ---');
  console.log(`${req.method} ${req.path} — ${new Date().toISOString()}`);
  next();
}

export default logger;
