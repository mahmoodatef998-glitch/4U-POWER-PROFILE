import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "shine inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-[background-color,color,box-shadow,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] [&_.flip-rtl]:transition-transform [&_.flip-rtl]:duration-300 hover:[&_.flip-rtl]:translate-x-1 rtl:hover:[&_.flip-rtl]:-translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-[1.15em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-[linear-gradient(120deg,var(--color-brand-400),var(--color-brand-500)_55%,#ffb627)] text-ink-950 shadow-[0_10px_28px_-10px_rgb(255_180_38/0.7)] hover:shadow-[0_16px_36px_-12px_rgb(255_170_38/0.85)]",
        whatsapp: "bg-[#0B7038] text-[#fff] hover:bg-[#095c2e] shadow-[0_8px_24px_-10px_rgb(18_140_75/0.7)]",
        dark: "border border-white/15 bg-white/[0.06] text-white backdrop-blur hover:bg-white/10",
        outline: "border border-white/15 bg-transparent text-white hover:border-white/35 hover:bg-white/5",
        ghostDark: "border border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10",
        ring: "ring-grad bg-white/[0.04] text-white backdrop-blur hover:bg-white/10",
        link: "rounded-none p-0 text-brand-700 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm sm:text-base",
        lg: "h-13 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
