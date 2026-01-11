import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/models";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    await connectDB();
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        const newUser = new User({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            googleId: account.providerAccountId,
                            isVerified: true,
                        });
                        await newUser.save();
                        console.log("New Google user created:", user.email);
                    } else {
                        console.log("Existing Google user logged in:", user.email);
                    }
                } catch (error) {
                    console.error("Error in Google sign-in:", error);
                    // Still return true to allow sign-in even if DB save fails
                    // User data will be in JWT token
                }
                return true;
            }

            if (account?.provider === "github") {
                try {
                    await connectDB();
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        const newUser = new User({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            githubId: account.providerAccountId,
                            isVerified: true,
                        });
                        await newUser.save();
                        console.log("New GitHub user created:", user.email);
                    } else {
                        console.log("Existing GitHub user logged in:", user.email);
                    }
                } catch (error) {
                    console.error("Error in GitHub sign-in:", error);
                    // Still return true to allow sign-in even if DB save fails
                }
                return true;
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }

            // Fetch fresh user data on each token refresh
            if (token.email) {
                await connectDB();
                const dbUser = await User.findOne({ email: token.email })
                    .select("_id email name role permissions isVerified image")
                    .lean();

                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                    token.permissions = dbUser.permissions || [];
                    token.isVerified = dbUser.isVerified;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                (session.user as any).role = token.role;
                (session.user as any).permissions = token.permissions;
                (session.user as any).isVerified = token.isVerified;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
