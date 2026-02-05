import Script from "next/script";

export function UrbanServiceSchema() {
	const schema = {
		"@context": "https://schema.org",
		"@type": "GovernmentService",
		name: "Rede de Apoio de Campinas",
		serviceType: "Assistência Social e Acolhimento",
		provider: {
			"@type": "GovernmentOrganization",
			name: "Prefeitura Municipal de Campinas",
			url: "https://www.campinas.sp.gov.br/",
		},
		areaServed: {
			"@type": "City",
			name: "Campinas",
			sameAs: "https://www.wikidata.org/wiki/Q171617",
		},
		audience: {
			"@type": "Audience",
			audienceType: "População em situação de rua",
		},
		availableChannel: {
			"@type": "ServiceChannel",
			serviceUrl: "https://caminhos-campinas.vercel.app/",
			availableLanguage: "pt-BR",
		},
	};

	return (
		<Script id="urban-service-schema" type="application/ld+json">
			{JSON.stringify(schema)}
		</Script>
	);
}
