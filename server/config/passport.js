const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("../module/User"); // ✅ fix path

passport.use(
  

new LinkedInStrategy(
  {
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/linkedin/callback",
    scope: ["openid", "profile", "email"],
  },


    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ linkedinId: profile.id });

        if (!user) {
          user = await User.create({
            name: profile.displayName,

            email:
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : `${profile.id}@linkedin.com`,

            linkedinId: profile.id,

            profileImage:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : "",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;