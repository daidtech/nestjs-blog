import Link from 'next/link';

type Props = {
  label: string;
  href?: string;
  count?: number;
  variant?: 'default' | 'category' | 'tag';
  size?: 'sm' | 'md';
  active?: boolean;
  onClick?: () => void;
};

export default function Badge({
  label,
  href,
  count,
  variant = 'default',
  size = 'sm',
  active = false,
  onClick,
}: Props) {
  const sizeClasses = size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';

  const variantClasses = {
    default: active
      ? 'bg-indigo-600 text-white'
      : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600',
    category: active
      ? 'bg-emerald-600 text-white'
      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    tag: active
      ? 'bg-indigo-600 text-white'
      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
  };

  const className = `inline-flex items-center gap-1 rounded-full font-medium transition-colors cursor-pointer ${sizeClasses} ${variantClasses[variant]}`;

  const content = (
    <>
      {label}
      {typeof count === 'number' && (
        <span className={`text-[10px] font-normal ${active ? 'opacity-75' : 'opacity-60'}`}>
          ({count})
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
