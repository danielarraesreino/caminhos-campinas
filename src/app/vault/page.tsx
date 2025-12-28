import { VaultPage } from "@/features/vault/VaultPage";
import { SessionProvider } from "next-auth/react";

export default function Page() {
	return (
		<SessionProvider>
			<main className="min-h-screen bg-slate-950 flex items-center justify-center">
				<VaultPage />
			</main>
		</SessionProvider>
	);
}
