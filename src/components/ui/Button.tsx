import Link from "next/link";

type Props = {
  href?: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
};

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
}: Props) {
  const base =
    "inline-block px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans transition-all duration-500 ease-out rounded active:scale-[0.97]";
  const variants = {
    primary:
      "bg-gradient-to-r from-pink-dark to-pink text-white hover:shadow-[0_0_24px_rgba(201,75,108,0.25)] hover:-translate-y-[2px] hover:scale-[1.02] delay-100",
    secondary:
      "border border-foreground/20 text-foreground hover:border-accent hover:text-accent hover:shadow-[0_0_16px_rgba(139,160,196,0.08)] hover:-translate-y-[1px] delay-100",
  };
  const cls = `${base} ${variants[variant]} ${className}`;

  if (href)
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  return <button className={cls}>{children}</button>;
}
