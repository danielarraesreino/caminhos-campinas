import { ProjectRegistrationForm } from "@/features/hub/ProjectRegistrationForm";

export default function HubPage() {
return (
<main className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans">
<header className="mb-8 text-center pt-8">
<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
Hub de Projetos
</h1>
<p className="text-slate-400 mt-2 max-w-md mx-auto">
Conectando quem quer ajudar com quem faz acontecer. Cadastre seu projeto ou coletivo.
</p>
</header>

<div className="max-w-xl mx-auto">
<ProjectRegistrationForm />
</div>

<footer className="mt-12 text-center text-xs text-slate-600">
<p>Os dados serão validados pela equipe antes de aparecerem no mapa.</p>
</footer>
</main>
);
}
