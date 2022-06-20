require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile"],
      state: true,
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

passport.use(
  new SpotifyStrategy(
    {
      clientID: "111c2e3a5a494a168a118b33fb7cebb0",
      clientSecret: "d252a6bdd6594ea1abc8d86e228db663",
      callbackURL: process.env.SPOTIFY_CALLBACK_URL,
      scope: ["user-read-email", "user-read-private"],
    },
    function (accessToken, refreshToken, expires_in, profile, cb) {
      return cb(null, profile);
    }
  )
);
