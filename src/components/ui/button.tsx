import Link from 'next/link';
import type { ComponentProps } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'saffron' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-60 cursor-pointer';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white shadow-[inset_0_-2px_0_rgb(0_0_0/0.18)] hover:bg-brand-strong',
  secondary: 'bg-surface text-ink ring-1 ring-line-strong hover:ring-ink/40 hover:bg-paper',
  ghost: 'text-ink hover:bg-ink/5',
  saffron: 'bg-saffron text-night shadow-[inset_0_-2px_0_rgb(0_0_0/0.15)] hover:bg-[#d48c1f]',
  inverse: 'bg-paper text-night hover:bg-white',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-7 text-base',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

interface Common {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant, size, className = '', ...props }: ComponentProps<'button'> & Common) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({ variant, size, className = '', ...props }: ComponentProps<typeof Link> & Common) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
