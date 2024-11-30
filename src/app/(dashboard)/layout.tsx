import { Navbar } from '@/components/navbar';
import { PropsWithChildren } from 'react';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='relative flex h-screen w-full flex-col'>
      <Navbar />
      <div className='w-full'>{children}</div>
    </div>
  );
};

export default DashboardLayout;
