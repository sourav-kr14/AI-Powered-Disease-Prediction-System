export default function PageHeader({ title, description, badge }) {
  return (
    <div className="mb-8 space-y-1.5">
      {badge && (
        <span className="inline-block rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-semibold text-[var(--primary)] mb-1">
          {badge}
        </span>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
        {title}
      </h1>
      {description && (
        <p className="text-sm sm:text-base text-[var(--text-sub)] max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
