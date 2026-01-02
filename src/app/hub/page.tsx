import partnersData from "@/data/partners.json";

export default function HubPage() {
	return (
		<div className="min-h-screen bg-slate-950 text-white p-8">
			<h1 className="text-4xl font-bold mb-4">Hub de Parceiros & Mapa</h1>
<<<<<<< HEAD
			<p className="mb-8 text-lg text-slate-300">
				Conheça a rede de apoio que sustenta a população em situação de rua em
				Campinas.
				<br />
				<span className="text-sm text-slate-500">
					Dados baseados em instituições reais.
				</span>
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{partnersData.map((partner) => (
					<div
						key={partner.id}
						className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-blue-500/50 transition-colors"
					>
						<div className="flex justify-between items-start mb-4">
							<h2 className="text-xl font-bold text-blue-100">
								{partner.name}
							</h2>
							<span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
								{partner.type}
							</span>
						</div>

						<p className="text-slate-400 text-sm mb-4 min-h-[40px]">
							{partner.description}
						</p>

						<div className="space-y-2 text-sm text-slate-300 mb-6">
							<div className="flex items-center gap-2">
								<span className="text-slate-500">📍</span>
								<span>{partner.address}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-slate-500">📞</span>
								<span>{partner.contact}</span>
							</div>
						</div>

						<div className="flex flex-wrap gap-2 mt-auto">
							{partner.services.map((service) => (
								<span
									key={service}
									className="text-xs px-2 py-1 rounded-full bg-blue-900/30 text-blue-300 border border-blue-900/50"
								>
									{service}
								</span>
							))}
						</div>
					</div>
				))}
			</div>

			<div className="mt-12 p-6 bg-slate-900/50 border border-dashed border-slate-800 rounded-lg text-center">
				<p className="text-slate-400">
					Você representa uma organização e quer fazer parte da rede?
				</p>
				<button
					type="button"
					className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors"
				>
					Cadastrar Instituição (Em Breve)
				</button>
			</div>
=======
			<p>
				Mapa das ONGs e formulário de cadastro para novos parceiros da rede.
			</p>
			<p className="mt-4 text-slate-400">Em construção...</p>
>>>>>>> 9ff5c3fb2de03e1743bce4b51ec2858e1a242085
		</div>
	);
}
