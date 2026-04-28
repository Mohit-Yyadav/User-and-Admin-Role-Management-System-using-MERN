const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../module/User"); // ✅ ONLY ONE IMPORT

const router = express.Router();

//
// STEP 1 → Redirect
//
router.get("/linkedin", (req, res) => {
  const url =
  "https://www.linkedin.com/oauth/v2/authorization" +
  `?response_type=code` +
  `&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI)}` +
  `&scope=openid%20profile%20email`;
  res.redirect(url);
});

//
// STEP 2 → Callback
//
router.get("/linkedin/callback", async (req, res) => {
//   console.log("CALLBACK HIT:", req.query);

  const { code } = req.query;

  try {
    // GET TOKEN
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // USER INFO (ONLY VALID OIDC ENDPOINT)
    const profileRes = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userData = profileRes.data;

    const email = userData.email;
    const name = userData.name;
    const linkedinId = userData.sub;

    // FIND OR CREATE USER
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        linkedinId,
        profileImage: "",
      });
    }

    // JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // FRONTEND REDIRECT
    res.redirect(
      `http://localhost:5173/linkedin-success?token=${token}`
    );
  } catch (err) {
    console.log("❌ LINKEDIN ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: "LinkedIn login failed",
      detail: err.message,
    });
  }
});
module.exports = router;