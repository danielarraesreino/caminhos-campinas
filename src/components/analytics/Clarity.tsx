"use client";

import { useEffect } from "react";
import { clarity } from "react-microsoft-clarity";

export default function Clarity() {
	useEffect(() => {
		const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
		if (clarityId) {
			clarity.init(clarityId);
		}
	}, []);

	return null;
}
