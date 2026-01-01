import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		// Google,
		Credentials({
			name: "Anônimo",
			credentials: {},
			async authorize() {
				// Retorna um usuário anônimo
				return {
					id: `anon-${Math.random().toString(36).substr(2, 9)}`,
					name: "Visitante",
					email: "anonimo@caminhoscampinas.com.br",
				};
			},
		}),
	],
	trustHost: true,
	secret: process.env.AUTH_SECRET,
	callbacks: {
		authorized: async ({ auth }) => {
			return !!auth;
		},
		async session({ session, token }) {
			if (token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
});
