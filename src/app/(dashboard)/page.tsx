import { Button } from '@/components/ui/button';
import prisma from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { CreateTransactionDialog } from './_components/create-transaction-dialog';
import { Overview } from './_components/overview';
import { History } from './_components/history';

const DashboardPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    return redirect('/wizard');
  }

  return (
    <div className='h-full bg-background'>
      <div className='border-b bg-card'>
        <div className='container mx-auto flex flex-wrap items-center justify-between gap-6 py-8 px-8'>
          <p className='text-3xl font-bold'>Hello, {user.firstName}! 👋</p>
          <div className='flex items-center gap-3'>
            <CreateTransactionDialog type='income'>
              <Button
                variant='outline'
                className='border-emerald-500 flex gap-2 items-center bg-emerald-950 text-white hover:bg-emerald-700'
              >
                <span>New Income</span>
                <span className='mt-1'>🤑</span>
              </Button>
            </CreateTransactionDialog>
            <CreateTransactionDialog type='expense'>
              <Button
                variant='outline'
                className='border-rose-500 flex gap-2 items-center bg-rose-950 text-white hover:bg-rose-700'
              >
                <span>New Expense</span>
                <span className='mt-1'>😤</span>
              </Button>
            </CreateTransactionDialog>
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
};

export default DashboardPage;
