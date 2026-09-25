import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };

export function Button({ children, className, type = "button", ...props }: ButtonProps): React.JSX.Element {
  return <button type={type} className={cn("button button-primary", className)} {...props}>{children}</button>;
}
