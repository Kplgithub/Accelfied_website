import { Bone, SkeletonStatus } from './skeleton';

/** The dashboard's side menu while the account loads: a row of pills on phones, a column on large screens. */
export function NavSkeleton() {
  return (
    <div aria-busy="true">
      <SkeletonStatus label="Loading menu" />
      <div className="flex gap-2 overflow-hidden lg:hidden">
        {[88, 72, 96, 80].map((width, index) => (
          <Bone key={index} className="h-9 shrink-0 rounded-full" style={{ width }} />
        ))}
      </div>
      <div className="hidden space-y-7 lg:block">
        {[2, 6, 3].map((count, group) => (
          <div key={group} className="space-y-2">
            <Bone className="mb-3 h-3 w-20" />
            {Array.from({ length: count }, (_, index) => (
              <Bone key={index} className="h-8 rounded-xl" style={{ width: `${88 - ((index * 13) % 30)}%` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
