import passport from 'passport';
import localStrategy from './local.strategy';
import jwtStrategy from './jwt.strategy';

passport.use(localStrategy);
passport.use(jwtStrategy);

// No serializeUser/deserializeUser — stateless JWT, no sessions

export default passport;
