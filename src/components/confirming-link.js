'use client';

import Link from 'next/link';
import { useDeckContext } from '@/context/deck-context';
import { useRouter, usePathname } from 'next/navigation';

export default function ConfirmingLink({className, href, children}) {
  const router = useRouter();
  const pathname = usePathname();
  const { hasChanges } = useDeckContext();

  const handleClick = (e) => {
    if (pathname.includes("/build/")) {
        if (hasChanges) {
            const confirmLeave = window.confirm('You have unsaved changes. Continue?');
            if (!confirmLeave) {
                e.preventDefault();
                return;
            }
        }
    }

    if (href !== pathname) {
      router.push(href);
      e.preventDefault();
    }
  };

  return (
    <Link className={className} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}