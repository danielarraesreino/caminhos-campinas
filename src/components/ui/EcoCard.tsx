import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface EcoCardProps extends HTMLAttributes<HTMLDivElement> {}

const EcoCard = forwardRef<HTMLDivElement, EcoCardProps>(
	({ className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"rounded-xl border border-[#333333] bg-[#000000] p-4 text-white shadow-sm",
					className,
				)}
				{...props}
			/>
		);
	},
);
EcoCard.displayName = "EcoCard";

export { EcoCard };
