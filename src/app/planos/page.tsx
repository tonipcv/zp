import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PlanosClient } from './client';
import { AppLayout } from '@/components/AppSidebar';

export default async function PlanosPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/planos');
  }
  
  return (
    <AppLayout>
      <PlanosClient userId={session.user.id} />
    </AppLayout>
  );
}