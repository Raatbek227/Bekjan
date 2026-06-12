import Link from "next/link";

const variants = {
  primary: "bg-accent text-black hover:bg-ember",
  secondary: "border border-white/15 bg-white/10 text-white hover:bg-white/15",
  ghost: "border border-white/10 bg-transparent text-white hover:bg-white/10"
};

export function Button({ href, children, className = "", variant = "primary", ariaLabel, ...props }) {
  const classes = `inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  );
}
