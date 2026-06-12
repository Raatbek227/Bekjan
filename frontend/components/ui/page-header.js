export function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.32em] text-accent">{eyebrow}</p>
      <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl">{title}</h1>
      {description ? <p className="mt-5 text-lg leading-8 text-muted">{description}</p> : null}
    </div>
  );
}
