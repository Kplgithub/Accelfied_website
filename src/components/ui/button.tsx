import Link from 'next/link';
import type { ComponentProps } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-60 cursor-pointer';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white shadow-[inset_0_-2px_0_rgb(0_0_0/0.18)] hover:bg-brand-strong',
  secondary: 'bg-surface text-ink ring-1 ring-line-strong hover:ring-ink/40 hover:bg-paper',
  ghost: 'text-ink hover:bg-ink/5',
  accent: 'bg-accent text-white shadow-[inset_0_-2px_0_rgb(0_0_0/0.15)] hover:bg-accent-strong',
  inverse: 'bg-paper text-night hover:bg-white',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-7 text-base',
};

/** Same sizes, but the height grows when a long label needs a second line on a narrow screen. */
const wrappingSizes: Record<Size, string> = {
  sm: 'min-h-9 px-4 py-1.5 text-sm',
  md: 'min-h-11 px-5 py-2 text-[15px]',
  lg: 'min-h-13 px-6 py-3 text-base sm:px-7',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '', wrap = false) {
  const sizing = wrap ? `${wrappingSizes[size]} text-center leading-snug text-balance` : `${sizes[size]} whitespace-nowrap`;
  return `${base} ${variants[variant]} ${sizing} ${extra}`;
}

interface Common {
  variant?: Variant;
  size?: Size;
  /** Let a long label wrap instead of spilling past the button's edges. */
  wrap?: boolean;
}

export function Button({ variant, size, wrap, className = '', ...props }: ComponentProps<'button'> & Common) {
  return <button className={buttonClass(variant, size, className, wrap)} {...props} />;
}

export function ButtonLink({ variant, size, wrap, className = '', ...props }: ComponentProps<typeof Link> & Common) {
  return <Link className={buttonClass(variant, size, className, wrap)} {...props} />;
}
