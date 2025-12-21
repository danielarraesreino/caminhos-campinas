import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const ecoButtonVariants = cva(
	"inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-[48px] min-w-[48px] px-4 py-2",
	{
		variants: {
			variant: {
				primary: "bg-black text-white border border-white hover:bg-neutral-900",
				danger:
					"bg-black text-red-500 border border-red-500 hover:bg-red-950/30",
				ghost: "bg-transparent text-white hover:bg-white/10 hover:text-white",
			},
			size: {
				default: "h-12 px-4 py-2",
				sm: "h-12 rounded-md px-3", // Forced min-height 48px even for small
				lg: "h-14 rounded-md px-8",
				icon: "h-12 w-12",
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
