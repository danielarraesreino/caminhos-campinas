import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google({
			authorization: {
				params: {
					scope:
						"openid email profile https://www.googleapis.com/auth/drive.file",
				},
			},
		}),
		Credentials({
			name: "Anonymous",
			credentials: {},
			async authorize(_credentials: Record<string, string> | undefined) {
				// Return a mock user for anonymous access
				return {
					id: "anonymous",
					name: "Viajante Anônimo",
					email: "anonimo@caminhoscampinas.game",
					image: null,
				};
			},
		}),
	],
	trustHost: true,
	secret: process.env.AUTH_SECRET,
	callbacks: {
		session({ session, token }) {
			// Persist user ID to session
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
});
