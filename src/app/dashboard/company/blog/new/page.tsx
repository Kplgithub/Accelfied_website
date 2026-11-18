import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { saveCompanyPost } from '@/app/company-post-actions';
import { CompanyPostForm } from '@/components/company-posts/post-form';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { NoCompany } from '@/components/dashboard/no-company';
import { getMyCompanyPosts } from '@/lib/company-posts-data';
import { formatMoney } from '@/lib/verified-plan';

export const metadata: Metadata = { title: 'New blog post' };

export default async function NewCompanyPostPage() {
  const data = await getMyCompanyPosts('/dashboard/company/blog/new');
  return (
    <>
      <Link href="/dashboard/company/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" /> Your posts
      </Link>
      <DashboardHeader
        eyebrow={data.company?.name ?? 'My company'}
        title="New blog post"
        intro={
          data.company
            ? `Save your draft first. You pay ${formatMoney(data.price.total, data.price.currency)} only when you send it to our team, and it goes live within ${data.reviewHours} hours.`
            : undefined
        }
      />
      {data.company ? (
        <Panel>
          <CompanyPostForm save={saveCompanyPost.bind(null, null)} />
        </Panel>
      ) : (
        <NoCompany />
      )}
    </>
  );
}
