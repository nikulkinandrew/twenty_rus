import { ReactNode } from 'react';

import { UserGuideMainLayout } from '@/app/_components/user-guide/UserGuideMainLayout';
import { getUserGuideArticles } from '@/content/user-guide/constants/getUserGuideArticles';

export default function UserGuideLayout({ children }: { children: ReactNode }) {
  const filePath = 'src/content/user-guide/';
  const userGuideIndex = getUserGuideArticles(filePath);
  return (
    <UserGuideMainLayout userGuideIndex={userGuideIndex}>
      {children}
    </UserGuideMainLayout>
  );
}
