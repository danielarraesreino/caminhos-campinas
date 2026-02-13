import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const ecoButtonVariants = cva(
	"inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-[64px] min-w-[64px] px-6 py-3 text-xl",
	{
		variants: {
			variant: {
				primary: "bg-black text-white border border-white hover:bg-neutral-900",
				danger:
					"bg-black text-red-500 border border-red-500 hover:bg-red-950/30",
				ghost: "bg-transparent text-white hover:bg-white/10 hover:text-white",
			},
			size: {
				default: "h-14 px-6 py-3",
				sm: "h-14 rounded-md px-4", // Mantém min-height 64px via classe base
				lg: "h-16 rounded-md px-8",
				icon: "h-14 w-14",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	},
);

export interface EcoButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof ecoButtonVariants> {}

const EcoButton = forwardRef<HTMLButtonElement, EcoButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<button
				type="button"
				className={cn(ecoButtonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
EcoButton.displayName = "EcoButton";

export { EcoButton, ecoButtonVariants };
