import { RefClick } from '@/components/auth/ref-click';
import { FocusPageMarker } from '@/components/layout/footer-main';

/** A form page: it gets the slim footer. */
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FocusPageMarker />
      <RefClick />
      {children}
    </>
  );
}
