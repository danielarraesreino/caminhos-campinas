import { auth } from "@/auth";
import { redirect } from "next/navigation";
import VaultClient from "./VaultClient";

export default async function VaultPage() {
	const session = await auth();

	if (!session) {
		redirect("/api/auth/signin?callbackUrl=/cofre");
	}

	return <VaultClient />;
}
