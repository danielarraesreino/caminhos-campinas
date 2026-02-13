"use client";

import Script from "next/script";
import { useEffect } from "react";

// Declaração de tipos para atributos customizados do VLibras
declare module "react" {
	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		vw?: string;
		"vw-access-button"?: string;
		"vw-plugin-wrapper"?: string;
	}
}

/**
 * VLibras Widget - Tradução automática para Libras (Brazilian Sign Language)
 * Official government plugin for accessibility
 */
export function VLibrasWidget() {
	useEffect(() => {
		// Ensure VLibras initializes after script loads
		const initVLibras = () => {
			if (typeof window !== "undefined" && (window as any).VLibras) {
				new (window as any).VLibras.Widget("https://vlibras.gov.br/app");
			}
		};

		// Try to initialize if script already loaded
		if ((window as any).VLibras) {
			initVLibras();
		}
	}, []);

	return (
		<>
			{/* VLibras Container */}
			<div vw="" className="enabled">
				<div vw-access-button="" className="active" />
				<div vw-plugin-wrapper="">
					<div className="vw-plugin-top-wrapper" />
				</div>
			</div>

			{/* VLibras Script */}
			<Script
				src="https://vlibras.gov.br/app/vlibras-plugin.js"
				strategy="afterInteractive"
				onLoad={() => {
					if (typeof window !== "undefined" && (window as any).VLibras) {
						new (window as any).VLibras.Widget("https://vlibras.gov.br/app");
					}
				}}
			/>
		</>
	);
}
