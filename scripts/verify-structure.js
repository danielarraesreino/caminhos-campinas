const fs = require("node:fs");
const path = require("node:path");

const COMPONENTS_DIR = path.join(__dirname, "../src/components");

function walkDir(dir, callback) {
	if (!fs.existsSync(dir)) return;
	fs.readdirSync(dir).forEach((f) => {
		const dirPath = path.join(dir, f);
		const isDirectory = fs.statSync(dirPath).isDirectory();
		if (isDirectory) {
			walkDir(dirPath, callback);
		} else {
			callback(path.join(dir, f));
		}
	});
}

console.log("Verificando componentes em:", COMPONENTS_DIR);
console.log("--------------------------------------------------");

let hasIssues = false;

walkDir(COMPONENTS_DIR, (filePath) => {
	if (!/\.(tsx|jsx)$/.test(filePath)) return;

	const content = fs.readFileSync(filePath, "utf8");

	// Check if file uses className
	const hasClassName = /className\s*=/.test(content);

	if (hasClassName) {
		// Check if it imports 'cn' from utils
		// Regex allows for import { cn } from ..., with various spacing and quotes
		// Also handles relative paths if someone used ../lib/utils (though @/lib/utils is preferred)
		const importsCn =
			/import\s+.*\{\s*cn\s*\}.*/.test(content) ||
			/import\s+.*cn\s+from/.test(content);

		// Strict check: if it has className but DOES NOT import cn, it's a warning.
		// Or if it uses className="..." (string literal) without cn()?
		// The requirement says "using manual classes without 'cn'".
		// Usually if they import cn, they are likely using it or intend to.
		// If they don't import it, they definitely aren't using it.

		if (!importsCn) {
			console.log(
				`Refatoração Necessária: ${path.relative(process.cwd(), filePath)}`,
			);
			console.log(`  -> Detectado 'className' mas sem importação de 'cn'.`);
			hasIssues = true;
		}
		// Optional: detect literal strings like className="foo" (harder to regex reliably without false positives on existing proper usage)
	}
});

if (!hasIssues) {
	console.log("Tudo certo! Nenhum problema de estrutura detectado.");
} else {
	console.log("--------------------------------------------------");
	console.log("Por favor, utilize a função cn() de @/lib/utils para classes.");
	process.exit(1);
}
