import Link from "next/link";
import { Heart, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-slate-950 border-t border-slate-800 py-10 px-6 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Logo / Brand */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        CAMINHOS CAMPINAS
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-xs">
                        Um jogo sério sobre invisibilidade social, dados e cidadania baseada em evidências.
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-400">
                    <Link href="/" className="hover:text-blue-400 transition-colors">Início</Link>
                    <Link href="/sobre" className="hover:text-blue-400 transition-colors">Sobre</Link>
                    <Link href="/jogar" className="hover:text-emerald-400 transition-colors">Jogar</Link>
                    <Link href="/impacto" className="hover:text-amber-400 transition-colors">Impacto</Link>
                    <Link href="/apoie" className="hover:text-pink-400 transition-colors">Apoie</Link>
                </nav>

                {/* Social / Credits */}
                <div className="flex flex-col items-center md:items-end gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                        <span>Desenvolvido por <strong>Daniel (Japa)</strong></span>
                        <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    </div>
                    <a
                        href="https://github.com/danielarraesreino/caminhos-campinas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-slate-400 transition-colors"
                    >
                        <Github className="w-4 h-4" />
                        <span>Código Aberto</span>
                    </a>
                </div>

            </div>

            <div className="mt-8 pt-6 border-t border-slate-900 text-center text-[10px] text-slate-700 uppercase tracking-widest">
                © {new Date().getFullYear()} Caminhos Campinas. Todos os direitos reservados.
            </div>
        </footer>
    );
}
