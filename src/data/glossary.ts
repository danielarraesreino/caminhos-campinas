/**
 * Glossário do Caminhos Campinas
 * Base teórica: Milton Santos, Robert Castel, Paulo Freire
 * Base jurídica: Decreto 7.053/2009
 */

export const GLOSSARY_TERMS = {
	// ═══════════════════════════════════════════════════════════════════
	// CONCEITOS SOCIOLÓGICOS (A Base Teórica)
	// ═══════════════════════════════════════════════════════════════════
	Rualização: {
		definition:
			"Não é apenas 'perder a casa'. É um processo gradual de adaptação à vida na rua, envolvendo a perda de vínculos e a criação de novas formas de sobrevivência. Quanto mais tempo na rua, mais profunda é a rualização e mais difícil a saída.",
		source: "Prates & Machado (2011) / Censo Campinas",
	},
	Aporofobia: {
		definition:
			"Do grego 'á-poros' (pobre) + 'fobos' (medo). É a aversão, medo ou desprezo pelos pobres. Explica a arquitetura hostil (pedras sob viadutos) e a violência gratuita contra quem vive na rua.",
		source: "Adela Cortina / ONU Brasil",
	},
	Desafiliação: {
		definition:
			"Conceito de Robert Castel. Define a exclusão não como um estado estático, mas como o rompimento de duas redes principais: a do trabalho (perda de renda) e a das relações de proximidade (família/comunidade).",
		source: "Projeto A Rua Tem Voz / Wanderley (1999)",
	},
	"Apartação Social": {
		definition:
			"O processo de tratar o outro não apenas como desigual, mas como um 'não-semelhante'. É o que permite que a sociedade ignore alguém dormindo na calçada como se fosse parte da paisagem.",
		source: "Buais / Projeto A Rua Tem Voz",
	},
	"Invisibilidade Estatística": {
		definition:
			"A discrepância entre quem o Estado 'vê' (Censo) e quem realmente existe. No jogo, isso ocorre quando você não tem documentos ou endereço, tornando-se invisível para benefícios sociais.",
		source: "IPEA / Censo FEAC 2024",
	},

	// ═══════════════════════════════════════════════════════════════════
	// SERVIÇOS E EQUIPAMENTOS (O Mapa de Sobrevivência)
	// ═══════════════════════════════════════════════════════════════════
	"Centro POP": {
		definition:
			"Centro de Referência Especializado. É o 'QG' da cidadania durante o dia: oferece banho, lavanderia, guarda-pertences e endereço institucional para quem não tem casa.",
		source: "MDS / Prefeitura de Campinas",
	},
	"Consultório na Rua": {
		definition:
			"Equipes de saúde (médicos, enfermeiros, psicólogos) que vão até onde a pessoa está (praças, viadutos). É a porta de entrada do SUS para quem tem dificuldade de ir até uma unidade fixa.",
		source: "Política Nacional de Atenção Básica",
	},
	SAMIM: {
		definition:
			"Serviço de Atendimento ao Migrante, Itinerante e Mendicante em Campinas. Conhecido por regras rígidas de horário e triagem, sendo a principal porta de pernoite emergencial.",
		source: "Prefeitura de Campinas / Rede de Serviços",
	},
	"Bom Prato": {
		definition:
			"Programa de segurança alimentar que oferece refeições a R$ 1,00. Para a população de rua cadastrada, a refeição é gratuita, sendo vital para o combate à fome (ODS 2).",
		source: "Governo de SP / Relatório Luz",
	},
	CadÚnico: {
		definition:
			"O 'RG Social'. Cadastro do Governo Federal que é a porta de entrada para o Bolsa Família, BPC e Tarifa Social. Sem ele, você é invisível para o sistema.",
		source: "IPEA / MDS",
	},

	// ═══════════════════════════════════════════════════════════════════
	// TERMOS DA RUA (A Realidade)
	// ═══════════════════════════════════════════════════════════════════
	Trecheiro: {
		definition:
			"Pessoa em situação de rua que está em constante movimento, migrando de cidade em cidade (o 'trecho') em busca de trabalho ou acolhimento, muitas vezes devido à falta de vínculos locais.",
		source: "Jornal O Trecheiro / Sociologia Urbana",
	},
	Fluxo: {
		definition:
			"Concentração de pessoas em uso de substâncias psicoativas em espaço público. Exige abordagem de Redução de Danos, não apenas segurança.",
		source: "Censo Pop Rua 2024",
	},
	Recâmbio: {
		definition:
			"Política pública que fornece passagens de ônibus para que a pessoa retorne à sua cidade de origem, visando o reestabelecimento de vínculos familiares.",
		source: "Portal PMC - Serviços",
	},
	RAPS: {
		definition:
			"Rede de Atenção Psicossocial. Conjunto de serviços (como CAPS AD e Consultório na Rua) focados em saúde mental e atendimento a usuários de álcool e drogas, vital para a redução de danos.",
		source: "Portaria GM/MS 3.088/2011",
	},
	"Redução de Danos": {
		definition:
			"Estratégia de saúde que não exige abstinência imediata, mas busca minimizar os prejuízos do uso de drogas. Foca na dignidade e no cuidado, em vez da punição ou isolamento.",
		source: "Ministério da Saúde / É de Lei",
	},

	// ═══════════════════════════════════════════════════════════════════
	// MARCOS LEGAIS (A Defesa Jurídica)
	// ═══════════════════════════════════════════════════════════════════
	"Decreto 7.053/2009": {
		definition:
			"Institui a Política Nacional para a População em Situação de Rua. Garante direitos fundamentais como alimentação, higiene, unidade familiar e acesso a serviços sem discriminação.",
		source: "Planalto / Legislação Federal",
	},
	"Lei Padre Júlio Lancellotti": {
		definition:
			"Lei Federal 14.489/2022 que proíbe o uso de técnicas construtivas hostis (pedras pontiagudas, grades, esguichos d'água) em espaços públicos para afastar pessoas em situação de rua.",
		source: "Congresso Nacional",
	},
	"Lei 10.216/2001": {
		definition:
			"Lei Antimanicomial (Lei Paulo Delgado). Estabelece que a internação psiquiátrica involuntária só pode ocorrer quando recursos extra-hospitalares forem insuficientes. Protege contra internações forçadas abusivas.",
		source: "Ministério da Saúde / RAPS",
	},
	"Interdito Proibitório": {
		definition:
			"Ordem judicial que, na prática, impede a permanência de pessoas em situação de rua em determinados locais, muitas vezes criminalizando a pobreza.",
		source: "Relatório Luz",
	},
};

export type GlossaryKey = keyof typeof GLOSSARY_TERMS;
