import { Briefcase, Code2, LayoutGrid, Megaphone, PenTool, Presentation, ServerCog } from 'lucide-react';

const ICONS = {
  development: Code2,
  'design-production': PenTool,
  marketing: Megaphone,
  advertising: Presentation,
  'business-services': Briefcase,
  'it-services': ServerCog,
} as const;

export function GroupIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug as keyof typeof ICONS] ?? LayoutGrid;
  return <Icon className={className} aria-hidden="true" />;
}
