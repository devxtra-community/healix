import express from "express";
import passport from "../../config/passport.js";
import {
  signUserAccessToken,
  signUserRefreshToken,
} from "../../utils/jwt.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    const user = req.user as any;

    const payload = {
      sub: user._id.toString(),
      role: "user",
      type: "user",
    };

    const accessToken = signUserAccessToken(payload);
    const refreshToken = signUserRefreshToken(payload);

    res.redirect(
      `http://localhost:3000/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

export default router;
