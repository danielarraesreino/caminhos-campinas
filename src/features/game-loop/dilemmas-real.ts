import type { Dilemma } from "./dilemma-types";

export const REAL_DILEMMAS: Dilemma[] = [
	{
		id: "dilema_menstruacao",
		title: "Período e Dignidade",
		description:
			"Seu período menstrual chegou e você não tem absorventes. O banheiro público do Largo do Rosário cobra R$ 2,00 para entrar ou exige que você compre algo nas lojas próximas para usar.",
		trigger: { type: "STATUS", value: 0.2, statusCondition: { hygiene: 30 } },
		options: [
			{
				label: "Usar miolo de pão/jornal (Risco à Saúde)",
				consequence:
					"Você improvisou com o que tinha. É desconfortável e inseguro, mas 'resolveu' a emergência imediata. O risco de infecção aumentou.",
				effect: { health: -15, dignity: -20, money: 0 },
			},
			{
				label: "Pedir ajuda na farmácia",
				consequence:
					"Você venceu a vergonha e pediu. A atendente foi solidária e te deu um pacote, mas você sentiu o olhar de julgamento dos outros clientes.",
				effect: { hygiene: 20, socialStigma: 10, dignity: -5 },
			},
		],
	},
	{
		id: "dilema_rapa_carrinho",
		title: "O Rapa Chegou",
		description:
			"A fiscalização municipal está fazendo uma operação de 'limpeza'. Eles estão confiscando carrinhos de reciclagem alegando 'uso indevido do espaço público'. Seu carrinho com R$ 40 em papelão está na calçada.",
		trigger: { type: "LOCATION", value: 0.1, locationId: "centro_glicerio" },
		options: [
			{
				label: "Enfrentar e argumentar",
				consequence:
					"Você tentou mostrar a lei que protege o catador. O guarda não gostou. Confiscou o carrinho e te ameaçou. Você perdeu sua ferramenta de trabalho.",
				effect: { money: -40, sanity: -20, socialStigma: 15 },
			},
			{
				label: "Abandonar e fugir",
				consequence:
					"Você correu apenas com sua mochila. O carrinho foi levado, mas você não foi fichado nem agredido. Terá que começar do zero amanhã.",
				effect: { money: -20, energy: -10, dignity: -10 },
			},
		],
	},
	{
		id: "dilema_cachorro_abrigo",
		title: "Amigo Fiel vs Teto",
		description:
			"Começou a chover forte e a temperatura caiu para 12°C. O Albergue Municipal (SAMIM) tem vaga, mas o porteiro avisa: 'Cachorro não entra'. Seu vira-lata, Caramelo, está tremendo.",
		trigger: { type: "STATUS", value: 0.3, statusCondition: { energy: 20 } },
		options: [
			{
				label: "Entrar e deixar o cão fora",
				consequence:
					"Você dormiu no quente e jantou. De manhã, Caramelo não estava mais lá. A culpa te consome.",
				effect: { energy: 50, health: 10, sanity: -40 },
			},
			{
				label: "Dormir na rua com ele",
				consequence:
					"Você e Caramelo se encolheram sob uma marquise. Você cobriu ele com seu casaco. Vocês estão molhados e doentes, mas juntos.",
				effect: { health: -20, sanity: 20, energy: -10 },
			},
		],
	},
	{
		id: "dilema_documento_banho",
		title: "A Mochila ou o Banho",
		description:
			"No Centro Pop, você pode tomar banho, mas não pode entrar com a mochila grande cheia de recicláveis. O guarda-volumes está lotado. Se deixar lá fora, podem roubar.",
		trigger: { type: "LOCATION", value: 0.2, locationId: "centro_pop_sare" },
		options: [
			{
				label: "Arriscar o banho",
				consequence:
					"O banho renovou suas forças. Mas ao sair, levaram seus tênis reservas e uma blusa. O prejuízo foi material, mas a higiene era necessária.",
				effect: { hygiene: 40, money: -10, sanity: -5 },
			},
			{
				label: "Desistir do banho",
				consequence:
					"Você continua sujo e as pessoas se afastam na rua. A coceira incomoda, mas suas coisas estão seguras.",
				effect: { hygiene: -10, socialStigma: 10, sanity: -5 },
			},
		],
	},
	{
		id: "dilema_bico_flanelinha",
		title: "Território Marcado",
		description:
			"Você achou uma vaga boa para olhar carros em dia de jogo do Guarani. Um outro flanelinha chega dizendo que o ponto é dele e mostra uma faca na cintura.",
		trigger: { type: "RANDOM", value: 0.1 },
		options: [
			{
				label: "Sair de fininho",
				consequence:
					"Você evitou a briga, mas perdeu a noite de ganhos. A humilhação de ter que ceder queima por dentro.",
				effect: { money: 0, sanity: -10, dignity: -5 },
			},
			{
				label: "Dividir o ponto (Negociar)",
				consequence:
					"Ele aceitou dividir, mas leva 70% do que você ganhar. É exploração, mas é melhor que nada.",
				effect: { money: 15, sanity: -5, socialStigma: 5 },
			},
		],
	},
	{
		id: "dilema_oficina_mosaico",
		title: "Arte e Vínculo",
		description:
			"O Cândido Ferreira oferece uma oficina de mosaico. Eles não pagam o dia, mas oferecem lanche e conversa. Você precisa de dinheiro para jantar, mas sente falta de ser tratado como gente.",
		trigger: { type: "LOCATION", value: 0.1, locationId: "casa_oficinas" },
		options: [
			{
				label: "Participar da Oficina",
				consequence:
					"Você passou a tarde colando caquinhos e conversando sobre a vida. Esqueceu a fome por horas. Ganhou um lanche e amigos.",
				effect: { sanity: 20, stabilityGap: -10, hunger: -10 },
			},
			{
				label: "Catar latinha",
				consequence:
					"Você fez R$ 15,00 rodando a tarde toda. Garantiu o jantar, mas a solidão e o cansaço mental pesam.",
				effect: { money: 15, sanity: -10, energy: -20 },
			},
		],
	},
	{
		id: "dilema_reciclagem_chuva",
		title: "Papelão Molhado",
		description:
			"Um temporal desabou. Seu papelão não está protegido por lona. Se molhar, o ferro-velho não compra ou paga metade do preço.",
		trigger: { type: "RANDOM", value: 0.2 },
		options: [
			{
				label: "Tentar cobrir na chuva",
				consequence:
					"Você salvou metade da carga, mas se encharcou completamente. Resfriado na certa.",
				effect: { money: 10, health: -20, energy: -10 },
			},
			{
				label: "Buscar abrigo (Perder carga)",
				consequence:
					"Você correu para uma marquise. O papelão virou pasta na chuva. Prejuízo total, mas você está seco.",
				effect: { money: -30, health: 0, sanity: -10 },
			},
		],
	},
	{
		id: "dilema_caps_medicacao",
		title: "Remédio ou Alerta",
		description:
			"No CAPS, o psiquiatra receitou um antipsicótico forte para suas vozes. O remédio ajuda, mas te dá um sono incontrolável. Dormir pesado na rua é perigoso.",
		trigger: { type: "LOCATION", value: 0.1, locationId: "caps_ad_reviver" },
		options: [
			{
				label: "Tomar a medicação",
				consequence:
					"As vozes sumiram e você teve paz mental. Mas dormiu no banco da praça e acordou sem seus sapatos.",
				effect: { sanity: 30, money: -20, dignity: -10 },
			},
			{
				label: "Jogar fora / Não tomar",
				consequence:
					"Você se mantém alerta e protege suas coisas. Mas a ansiedade e as alucinações voltam com tudo à noite.",
				effect: { sanity: -20, energy: -5 },
			},
		],
	},
	{
		id: "dilema_igreja_sopa",
		title: "A Sopa e o Sermão",
		description:
			"Um grupo religioso distribui sopa. Eles exigem que você participe de um culto de 1 hora antes de comer. Sua barriga dói de fome.",
		trigger: { type: "LOCATION", value: 0.1, locationId: "largo_rosario" },
		options: [
			{
				label: "Aceitar as regras",
				consequence:
					"Você ouviu o culto. Alguns olhares eram de pena, outros de nojo. Mas a sopa estava quente e salvou sua noite.",
				effect: { hunger: 50, dignity: -5, sanity: 5 },
			},
			{
				label: "Recusar e sair",
				consequence:
					"Você manteve sua autonomia religiosa/pessoal, mas dormiu com fome.",
				effect: { hunger: -20, dignity: 10, sanity: -5 },
			},
		],
	},
	{
		id: "dilema_rg_perdido",
		title: "O RG Sumiu",
		description:
			"Você foi revistado pela polícia e seus documentos não foram devolvidos ou caíram na confusão. Sem RG, você não entra no abrigo nem pega remédio controlado.",
		trigger: { type: "RANDOM", value: 0.05 },
		options: [
			{
				label: "Ir ao Poupatempo (Exige Agendamento/Taxa)",
				consequence:
					"É uma saga. Precisa de foto 3x4 (paga) e agendamento (internet). Sem dinheiro e pc, você depende de favor.",
				effect: { money: -20, stabilityGap: -5, sanity: -10 },
			},
			{
				label: "Pedir ajuda na Casa da Cidadania",
				consequence:
					"Eles fazem a 2ª via gratuita para população de rua. Demora 30 dias, mas é o caminho seguro.",
				effect: { money: 0, stabilityGap: -20, dignity: 5 },
			},
		],
	},
	{
		id: "dilema_exclusao_digital_poupatempo",
		title: "Exclusão Digital",
		description:
			"Você precisa agendar a 2ª via do RG no Poupatempo. O agendamento é 100% online. Você não tem celular nem dados móveis. A Lan House cobra R$ 5,00 por 15 minutos.",
		trigger: { type: "RANDOM", value: 0.05 },
		options: [
			{
				label: "Pagar a Lan House",
				consequence:
					"Você gastou o dinheiro do almoço para acessar o site. O sistema do governo caiu e você perdeu o dinheiro e o tempo.",
				effect: { money: -5, hunger: 20, sanity: -15 },
			},
			{
				label: "Pedir favor a um passante",
				consequence:
					"Apareceu alguém apressado que te emprestou o celular. Você agendou, mas a humilhação de segurar um aparelho de 5 mil reais com as mãos sujas doeu.",
				effect: { dignity: -10, sanity: 5, stabilityGap: -5 },
			},
		],
	},
	{
		id: "dilema_cep_impossivel",
		title: "O CEP Impossível (Catch-22)",
		description:
			"Você conseguiu uma entrevista de emprego! O RH pede comprovante de residência. Sem endereço, não tem emprego. Sem emprego, não tem endereço para alugar quarto.",
		trigger: { type: "LOCATION", value: 0.15, locationId: "cpat_centro" },
		options: [
			{
				label: "Usar endereço do SAMIM",
				consequence:
					"O recrutador reconheceu o endereço do albergue municipal: 'Rua Francisco Elisiário'. O preconceito venceu. A vaga 'já foi preenchida'.",
				effect: { dignity: -20, sanity: -20, socialStigma: 20 },
			},
			{
				label: "Mentir (Endereço de Parente)",
				consequence:
					"Você deu o endereço de uma tia distante. Passou na triagem, mas vive com o medo constante de descobrirem a mentira e te demitirem por justa causa.",
				effect: { money: 0, sanity: -10, stabilityGap: -10 },
			},
		],
	},
];
