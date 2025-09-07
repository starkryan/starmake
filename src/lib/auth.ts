import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        default: 'user',
        enum: ['user', 'admin'],
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectUri: process.env.GOOGLE_REDIRECT_URI || "http://localhost:3001/api/auth/callback/google",
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (userData) => {
          // Ensure role is set to 'user' if not provided
          if (!userData.role) {
            userData.role = 'user';
          }
          return { data: userData };
        },
      },
    },
  },
});

// Helper functions for role-based access
export const requireAuth = async (request: Request) => {
  return await auth.api.getSession({ headers: request.headers });
};

export const requireAdmin = async (request: Request) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return session;
};

export const requireUser = async (request: Request) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    throw new Error('Authentication required');
  }
  return session;
};
