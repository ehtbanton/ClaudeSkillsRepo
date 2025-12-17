import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { UserService } from '../services/user.service';

const userService = new UserService();

// Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userService.findOrCreateOAuth({
          provider: 'google',
          providerId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
        });
        done(null, user);
      } catch (error) {
        done(error as Error);
      }
    }
  )
);

// GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: '/api/auth/github/callback',
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userService.findOrCreateOAuth({
          provider: 'github',
          providerId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName || profile.username,
          avatar: profile.photos?.[0]?.value,
        });
        done(null, user);
      } catch (error) {
        done(error as Error);
      }
    }
  )
);

export default passport;
