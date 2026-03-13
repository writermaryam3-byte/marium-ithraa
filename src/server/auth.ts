import { AuthOptions, DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { Environments, Pages, Routes } from "@/lib/types/enums";
import { UserRole } from "@/features/users";
import { refreshAccessToken } from "@/lib/utils";
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: DefaultSession["user"] & {
            id: string;
            phone?: string;
            role: UserRole;
            accessToken: string;
        };
        error?: "RefreshAccessTokenError";
    }

    interface User {
        id: string;
        phone?: string;
        role: UserRole;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        accessToken: string;
        refreshToken: string;
        accessTokenExpires: number;
        role: UserRole;
        phone?: string;
        error?: "RefreshAccessTokenError"
    }
}


const nextAuthOptions: AuthOptions = {
    callbacks: {
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id,
                role: token.role,
                accessToken: token.accessToken,
                phone: token.phone,
            };

            session.error = token.error;

            return session;
        },
        async jwt({ token, user }) {
            // أول login
            if (user) {
              return {
                ...token,
                id: user.id,
                accessToken: user.accessToken,
                refreshToken: user.refreshToken,
                accessTokenExpires: Date.now() + user.expiresIn * 1000,
                role: user.role,
                phone: user.phone,
              };
            }
          
            // التوكن لسه صالح
            if (Date.now() < token.accessTokenExpires) {
              return token;
            }
          
            // اعمل refresh
            return refreshAccessToken(token);
          }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === Environments.DEV,
    providers: [Credentials({
        name: "Credentials",
        credentials: {
            phone: { label: "phone", type: "text", placeholder: "+0125546262615" },
            password: { label: "Password", type: "password" }

        },
        async authorize(credentials) {
            try {
                const apiBaseUrl = process.env.BACKEND_URL;
                if (!apiBaseUrl) return null;

                const payload = {
                  phone: credentials?.phone,
                  password: credentials?.password,
                };

                const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                    headers: { "Content-Type": "application/json" },
                    cache: "no-store",
                });
                if (!res.ok) return null;
                
                const user = await res.json();
                console.log(user)
                return user;
            } catch {
                return null;
            }

        }
    }
    )],
    pages: {
        signIn: `/${Routes.AUTH}/${Pages.LOGIN}`,
    },
}

export default nextAuthOptions