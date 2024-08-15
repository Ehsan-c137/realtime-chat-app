import { ButtonHTMLAttributes, FC } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
   "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900",
   {
      variants: {
         variant: {
            default:
               "bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:hover:text-slate-900",
            outline:
               "bg-slate-50 text-slate-900 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800",
            ghost: "bg-transparent text-black hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-50 dark:hover:text-slate-50 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent",
            link: "bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-50 hover:bg-transparent dark:hover:bg-transparent",
         },
         size: {
            default: "h-10 py-2 px-4",
            sm: "h-9 px-2 rounded-md",
            lg: "h-11 px-8 rounded-md",
         },
      },
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   }
);

export interface ButtonProps
   extends ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariants> {
   isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
   className,
   children,
   variant,
   isLoading,
   size,
   ...props
}) => {
   return (
      <button
         disabled={isLoading}
         className={cn(buttonVariants({ variant, size, className }))}
         {...props}
      >
         {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
         {children}
      </button>
   );
};

export default Button;
