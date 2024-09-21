const passport = require('passport');
const { GOOGLE_CLIENT_ID , GOOGLE_CLIENT_SECRET} = require('./config');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const CALLBACK_URL = `http://localhost:${PORT}/auth/google/callback`;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  // In a real app, save the user to the database
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
