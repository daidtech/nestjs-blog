import passport from 'passport';
import localStrategy from './local.strategy';

passport.use(localStrategy);

// No serializeUser/deserializeUser — stateless JWT, no sessions

export default passport;
