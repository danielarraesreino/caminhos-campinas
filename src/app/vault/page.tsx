import { SessionProvider } from "next-auth/react";
import { VaultPage } from "@/features/vault/VaultPage";

export default function Page() {
	return (
		<SessionProvider>
			<main className="min-h-screen bg-slate-950 flex items-center justify-center">
				<VaultPage />
			</main>
		</SessionProvider>
	);
}
