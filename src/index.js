const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport");

const app = express();

//Configure Session Storage
app.use(
  cookieSession({
    name: "session-name",
    keys: ["key1", "key2"],
  })
);

//Configure Passport
app.use(passport.initialize());
app.use(passport.session());

//Unprotected Routes
app.get("/", (req, res) => {
  console.log("Home. Req: ", Object.keys(req));
  if (req.session) {
    req.session = null;
  }
  if (req.user) {
    req.logout();
  }
  res.send(
    "<h1>Home</h1></br><a href='/auth/spotify'>Log in with Spotify</a></br><a href='/auth/google'>Log in with Google</a>"
  );
});

app.get("/failed", (req, res) => {
  res.send("<h1>Log in Failed :(</h1>");
});

// Middleware - Check user is Logged in
const checkUserLoggedInWithGoogle = (req, res, next) => {
  req.user && req.user.provider === "google"
    ? next()
    : res.redirect("/auth/google");
};

const checkUserLoggedInWithSpotify = (req, res, next) => {
  req.user && req.user.provider === "spotify"
    ? next()
    : res.redirect("/auth/spotify");
};

//Protected Route.
app.get("/google/profile", checkUserLoggedInWithGoogle, (req, res) => {
  console.log("Google. Req: ", req);
  res.send(
    `<h1>${req.user.displayName}'s Profile Page</h1><a href='/'>Home</a></br><a href='/logout'>Log Out</a>`
  );
});

app.get("/spotify/profile", checkUserLoggedInWithSpotify, (req, res) => {
  console.log("Spotify. Req: ", req);
  res.send(
    `<h1>${req.user.displayName}'s Profile Page</h1><a href='/'>Home</a></br><a href='/logout'>Log Out</a>`
  );
});

// Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    res.redirect("/google/profile");
  }
);

app.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
    showDialog: true,
  })
);

app.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/failed" }),
  function (req, res) {
    res.redirect("/spotify/profile");
  }
);

//Logout
app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

app.listen(3000, () => console.log(`App listening on port ${3000} 🚀🔥`));
