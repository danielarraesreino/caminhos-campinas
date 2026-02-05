const fs = require("fs");
const path = require("path");

// Caminho do arquivo de dilemas
const filePath = path.join(__dirname, "src", "data", "dilemmas-campinas.json");

// Novos Dilemas do Arco 3 (Baseados em "Desabafo" e "A Rua Tem Voz")
const newDilemmas = [
	{
		id: "arco3_start_rualogia",
		title: "O Insight da Rualogia",
		description:
			"Você sobreviveu à fome e aos xinglings. Mas a dor continua. Você se lembra do 'Jornal Boca de Rua' de Porto Alegre e dos jornalistas formados na sarjeta. Você percebe que sua vivência não é lixo, é 'Rualogia'. É hora de parar de pedir e começar a falar.",
		trigger: { type: "STATUS", attribute: "knowledge", value: 50 },
		options: [
			{
				label: "Fundar 'A Voz da Rua' (Escrever)",
				consequence:
					"Você pega um caderno velho. Escreve sobre o frio, o 'rapa' e a invisibilidade. As pessoas param para ler. Você não é mais invisível, você é um cronista da realidade.",
				effect: { sanity: 20, citizenship: 15, energy: -10 },
				nextDilemmaId: "arco3_vereadores_busca",
			},
			{
				label: "Ignorar e continuar sobrevivendo",
				consequence:
					"Você guarda a ideia. A rua continua muda. A oportunidade de mudar a narrativa passou e a rotina te engole novamente.",
				effect: { sanity: -5, money: 2 },
			},
		],
		source_fact:
			"Baseado em: 'Desabafo' e a experiência do Jornal Boca de Rua. [Source 359, 907]",
	},
	{
		id: "arco3_vereadores_busca",
		title: "A Porta do Gabinete",
		description:
			"Para imprimir o jornal, você precisa de apoio. Você lista 5 vereadores. 4 de esquerda, 1 de direita. Você bate na porta dos gabinetes com seu projeto debaixo do braço, buscando recursos para a gráfica.",
		trigger: { type: "CHAIN", value: 0 },
		options: [
			{
				label: "Procurar os progressistas",
				consequence:
					"Um te atende, mas o espaço está em reforma. Outros dois te dão o 'vácuo'. Um apoia. É difícil furar a bolha, mesmo entre os 'aliados'.",
				effect: { citizenship: 10, sanity: -10, stress: 20 },
				nextDilemmaId: "arco3_vereadores_vacuo",
			},
			{
				label: "Tentar o vereador de direita",
				consequence:
					"Ele rejeita a ligação, pede áudio. Você insiste. Ele atende, diz que a pauta é relevante, mas não retorna. O silêncio é universal.",
				effect: { knowledge: 20, dignity: -10 },
				nextDilemmaId: "arco3_vereadores_vacuo",
			},
		],
		source_fact:
			"Baseado em: 'Desabafo' - A saga com os 5 vereadores e o vácuo institucional. [Source 361, 363]",
	},
	{
		id: "arco3_vereadores_vacuo",
		title: "O Vácuo Institucional",
		description:
			"Dos três vereadores que não retornaram, dois conhecem seu trabalho de distribuir comida no 'Borto'. Mesmo assim, silêncio. O ódio sobe nas veias. Você percebe que discursos não pagam a gráfica.",
		trigger: { type: "CHAIN", value: 0 },
		options: [
			{
				label: "Agir com Ódio (Denúncia)",
				consequence:
					"Você escreve um texto inflamado denunciando o descaso. O jornal vende muito pela polêmica, mas você queima pontes políticas importantes.",
				effect: { money: 50, socialStigma: 20, security: -20 },
				nextDilemmaId: "arco3_jornal_venda",
			},
			{
				label: "Ser Didático (Estratégia)",
				consequence:
					"Você engole o orgulho. Usa a 'Rualogia' para explicar a situação sem atacar. Consegue um pequeno apoio da sociedade civil para imprimir a primeira tiragem.",
				effect: { citizenship: 30, sanity: 10, money: -10 },
				nextDilemmaId: "arco3_jornal_venda",
			},
		],
		source_fact:
			"Baseado em: 'Desabafo' - A decisão entre o ódio e ser didático. [Source 363]",
	},
	{
		id: "arco3_jornal_venda",
		title: "Jornalista ou Pedinte?",
		description:
			"Você está na sinaleira com o jornal impresso. Custa R$ 3,00. As pessoas estão acostumadas a te ver pedindo. Quando você oferece cultura e informação, a lógica da caridade quebra.",
		trigger: { type: "CHAIN", value: 0 },
		options: [
			{
				label: "Vender como 'Ajuda'",
				consequence:
					"Você apela para a caridade ('ajuda o tio'). Vende rápido, mas ninguém lê. O dinheiro entra, mas a mensagem morre no banco do carro.",
				effect: { money: 30, dignity: -10 },
				nextDilemmaId: "fim_ciclo_ativista",
			},
			{
				label: "Vender como 'Produto'",
				consequence:
					"Você argumenta sobre o conteúdo: 'Leia sobre a vida real'. Vende menos, mas quem compra, lê. Um estudante para e conversa. Você criou um laço.",
				effect: { citizenship: 40, money: 15, sanity: 20 },
				nextDilemmaId: "fim_ciclo_ativista",
			},
		],
		source_fact:
			"Baseado em: 'A Rua Tem Voz' - A venda do jornal por 3 reais e a quebra de estigma. [Source 907]",
	},
];

// Ler arquivo existente
fs.readFile(filePath, "utf8", (err, data) => {
	if (err) {
		console.error("Erro ao ler o arquivo:", err);
		return;
	}

	let existingDilemmas = [];
	try {
		existingDilemmas = JSON.parse(data);
	} catch (parseErr) {
		console.error("Erro ao fazer parse do JSON:", parseErr);
		return;
	}

	// Filtrar duplicatas (caso o script rode mais de uma vez)
	const existingIds = new Set(existingDilemmas.map((d) => d.id));
	const dilemmasToAdd = newDilemmas.filter((d) => !existingIds.has(d.id));

	if (dilemmasToAdd.length === 0) {
		console.log("⚠️  Todos os dilemas do Arco 3 já existem no banco de dados.");
		return;
	}

	// Adicionar novos dilemas
	const updatedDilemmas = [...existingDilemmas, ...dilemmasToAdd];

	// Salvar
	fs.writeFile(
		filePath,
		JSON.stringify(updatedDilemmas, null, 2),
		(writeErr) => {
			if (writeErr) {
				console.error("Erro ao salvar:", writeErr);
			} else {
				console.log(
					`✅ Sucesso! ${dilemmasToAdd.length} dilemas do Arco 3 adicionados.`,
				);
				console.log(`📜 Total de dilemas agora: ${updatedDilemmas.length}`);
			}
		},
	);
});
