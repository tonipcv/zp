import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { WhatsAppInstances } from '@/components/whatsapp/WhatsAppInstances';
import { AppLayout } from '@/components/AppSidebar';

export const metadata: Metadata = {
  title: 'Cxlus AI',
  description: 'Manage your WhatsApp Business instances',
};

export default async function WhatsAppPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <AppLayout>
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Title */}
          <div className="mb-4">
            <h1 className="text-sm font-medium text-[#f5f5f7] tracking-[-0.03em]">
              WhatsApp Business
            </h1>
            <p className="text-xs text-[#f5f5f7]/60 tracking-[-0.03em]">
              Manage your instances and connect with your customers
            </p>
          </div>

          {/* WhatsApp Component */}
          <WhatsAppInstances />
        </div>
      </div>
    </AppLayout>
  );
}