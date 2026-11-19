import { Container } from '@/components/ui/container';
import { Bone, SkeletonStatus, SkeletonText } from './skeleton';

/** Hero area of directory, industry and tool pages. */
export function HeroSkeleton({ className = 'py-12 lg:py-16' }: { className?: string }) {
  return (
    <section className="grain border-b border-line">
      <Container className={className}>
        <SkeletonStatus />
        <Bone className="h-4 w-40" />
        <Bone className="mt-5 h-11 w-2/3 rounded-lg" />
        <Bone className="mt-5 h-5 w-1/2" />
      </Container>
    </section>
  );
}

/** One company card in a directory list: logo, name, rating, service chips, text and buttons. */
export function CompanyCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="flex gap-4">
        <Bone className="size-16 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1">
          <Bone className="h-5 w-1/2" />
          <div className="mt-2.5 flex items-center gap-2">
            <Bone className="h-4 w-24" />
            <Bone className="h-4 w-16" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Bone className="h-6 w-28 rounded-full" />
            <Bone className="h-6 w-20 rounded-full" />
            <Bone className="h-6 w-24 rounded-full" />
          </div>
        </div>
        <div className="hidden w-36 shrink-0 flex-col gap-2 sm:flex">
          <Bone className="h-10 rounded-full" />
          <Bone className="h-10 rounded-full" />
        </div>
      </div>
      <SkeletonText lines={2} className="mt-5" />
    </div>
  );
}

export function CompanyListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div aria-busy="true">
      <SkeletonStatus label="Loading companies" />
      <div className="flex gap-3">
        <Bone className="h-11 flex-1 rounded-xl" />
        <Bone className="h-11 w-40 rounded-xl" />
      </div>
      <div className="mt-8 grid gap-5">
        {Array.from({ length: count }, (_, index) => (
          <CompanyCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  // At least a screen tall, so the footer never flashes into view and then jumps away when the profile streams in.
  return (
    <div aria-busy="true" className="min-h-dvh">
      <SkeletonStatus label="Loading profile" />
      <section className="grain border-b border-line">
        <Container className="flex items-center gap-5 py-14">
          <Bone className="size-22 shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <Bone className="h-10 w-1/2 rounded-lg" />
            <Bone className="h-5 w-1/3" />
            <div className="flex gap-2 pt-1">
              <Bone className="h-10 w-32 rounded-full" />
              <Bone className="h-10 w-32 rounded-full" />
            </div>
          </div>
        </Container>
      </section>
      <Container className="grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <Bone className="mb-5 h-6 w-48" />
            <SkeletonText lines={5} />
          </div>
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <Bone className="mb-5 h-6 w-40" />
            <SkeletonText lines={4} />
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
          <Bone className="mx-auto size-40 rounded-full" />
          <SkeletonText lines={4} className="mt-6" />
        </div>
      </Container>
    </div>
  );
}

export function PostGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      <SkeletonStatus label="Loading articles" />
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
          <Bone className="aspect-[16/10] w-full rounded-none" />
          <div className="p-5">
            <Bone className="h-3.5 w-24" />
            <Bone className="mt-3 h-6 w-11/12" />
            <Bone className="mt-2 h-6 w-2/3" />
            <SkeletonText lines={2} className="mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Blog posts, comparison pages and tools: title, picture and paragraphs. */
export function ArticleSkeleton() {
  return (
    <div aria-busy="true" className="min-h-[60vh]">
      <SkeletonStatus />
      <Container className="max-w-3xl py-12 lg:py-16">
        <Bone className="h-4 w-32" />
        <Bone className="mt-5 h-11 w-full rounded-lg" />
        <Bone className="mt-3 h-11 w-3/4 rounded-lg" />
        <div className="mt-6 flex items-center gap-3">
          <Bone className="size-10 rounded-full" />
          <Bone className="h-4 w-40" />
        </div>
        <Bone className="mt-8 aspect-[16/9] w-full rounded-[var(--radius-card)]" />
        <SkeletonText lines={5} className="mt-8" />
        <SkeletonText lines={4} className="mt-6" />
      </Container>
    </div>
  );
}

/** Long forms (quote, brief, review, listing): heading, a step bar and fields. */
export function FormSkeleton({ className = '' }: { className?: string }) {
  return (
    <div aria-busy="true" className={`rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8 ${className}`}>
      <SkeletonStatus />
      <Bone className="h-4 w-32" />
      <Bone className="mt-4 h-9 w-2/3 rounded-lg" />
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 5 }, (_, index) => (
          <Bone key={index} className="h-1.5 flex-1 rounded-full" />
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <span key={index} className="block space-y-2">
            <Bone className="h-3.5 w-24" />
            <Bone className="h-11 w-full rounded-xl" />
          </span>
        ))}
      </div>
      <Bone className="mt-8 h-12 w-40 rounded-full" />
    </div>
  );
}

/** Industry pages: hero, then a list of companies. */
export function IndustrySkeleton() {
  return (
    <div className="min-h-[60vh]">
      <HeroSkeleton />
      <Container className="py-10">
        <CompanyListSkeleton count={2} />
      </Container>
    </div>
  );
}

/** Log in and join: a centred card with social buttons and two fields. */
export function AuthSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <Container className={`flex justify-center py-12 lg:py-16 ${tall ? 'min-h-[720px]' : 'min-h-[560px]'}`}>
      <div aria-busy="true" className="w-full max-w-md rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
        <SkeletonStatus />
        <Bone className="mx-auto h-8 w-2/3 rounded-lg" />
        <Bone className="mx-auto mt-3 h-4 w-1/2" />
        <div className="mt-8 space-y-3">
          <Bone className="h-11 w-full rounded-full" />
          <Bone className="h-11 w-full rounded-full" />
        </div>
        <div className="mt-8 space-y-5">
          {[0, 1].map((index) => (
            <span key={index} className="block space-y-2">
              <Bone className="h-3.5 w-24" />
              <Bone className="h-11 w-full rounded-xl" />
            </span>
          ))}
        </div>
        <Bone className="mt-8 h-12 w-full rounded-full" />
      </div>
    </Container>
  );
}
