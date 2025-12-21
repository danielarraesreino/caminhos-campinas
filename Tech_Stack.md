{
	"name": "pop-rua-game",
	"version": "0.1.0",
	"private": true,
	"scripts": {
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"lint": "biome check src/",
		"format": "biome format --write src/",
		"prepare": "husky"
	},
	"lint-staged": {
		"*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
			"biome check --write --no-errors-on-unmatched"
		]
	},
	"dependencies": {
		"@ai-sdk/google": "^2.0.47",
		"@ai-sdk/react": "^2.0.115",
		"@radix-ui/react-dialog": "^1.1.15",
		"@radix-ui/react-progress": "^1.1.8",
		"@radix-ui/react-slot": "^1.2.4",
		"@types/leaflet": "^1.9.21",
		"@types/pouchdb": "^6.4.2",
		"ai": "^5.0.113",
		"class-variance-authority": "^0.7.1",
		"clsx": "^2.1.1",
		"leaflet": "^1.9.4",
		"lucide-react": "^0.561.0",
		"next": "16.0.10",
		"next-auth": "^5.0.0-beta.30",
		"pouchdb": "^9.0.0",
		"react": "19.2.1",
		"react-dom": "19.2.1",
		"react-leaflet": "^5.0.0",
		"tailwind-merge": "^3.4.0",
		"zustand": "^5.0.9"
	},
	"devDependencies": {
		"@biomejs/biome": "^2.3.9",
		"@tailwindcss/postcss": "^4",
		"@types/node": "^20",
		"@types/react": "^19",
		"@types/react-dom": "^19",
		"eslint": "^9",
		"eslint-config-next": "16.0.10",
		"husky": "^9.1.7",
		"lint-staged": "^16.2.7",
		"tailwindcss": "^4",
		"tw-animate-css": "^1.4.0",
		"typescript": "^5"
	}
}
{
	"compilerOptions": {
		"target": "ES2017",
		"lib": ["dom", "dom.iterable", "esnext"],
		"allowJs": true,
		"forceConsistentCasingInFileNames": true,
		"skipLibCheck": true,
		"strict": true,
		"noEmit": true,
		"esModuleInterop": true,
		"module": "esnext",
		"moduleResolution": "bundler",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"jsx": "react-jsx",
		"incremental": true,
		"plugins": [
			{
				"name": "next"
			}
		],
		"paths": {
			"@/*": ["./src/*"]
		}
	},
	"include": [
		"next-env.d.ts",
		"**/*.ts",
		"**/*.tsx",
		".next/types/**/*.ts",
		".next/dev/types/**/*.ts",
		"**/*.mts"
	],
	"exclude": ["node_modules"]
}
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
};

export default nextConfig;
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
{
	"$schema": "https://ui.shadcn.com/schema.json",
	"style": "new-york",
	"rsc": true,
	"tsx": true,
	"tailwind": {
		"config": "",
		"css": "src/app/globals.css",
		"baseColor": "neutral",
		"cssVariables": true,
		"prefix": ""
	},
	"iconLibrary": "lucide",
	"aliases": {
		"components": "@/components",
		"utils": "@/lib/utils",
		"ui": "@/components/ui",
		"lib": "@/lib",
		"hooks": "@/hooks"
	},
	"registries": {}
}
{
	"$schema": "https://biomejs.dev/schemas/2.3.9/schema.json",
	"vcs": {
		"enabled": true,
		"clientKind": "git",
		"useIgnoreFile": true
	},
	"files": {
		"ignoreUnknown": false
	},
	"formatter": {
		"enabled": true,
		"indentStyle": "tab"
	},
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true
		}
	},
	"javascript": {
		"formatter": {
			"quoteStyle": "double"
		}
	},
	"assist": {
		"enabled": true,
		"actions": {
			"source": {
				"organizeImports": "on"
			}
		}
	}
}
