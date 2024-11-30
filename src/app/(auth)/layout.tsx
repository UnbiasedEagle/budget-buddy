import { Logo } from '@/components/logo';
import { PropsWithChildren } from 'react';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='relative h-screen flex w-full flex-col items-center justify-center'>
      <Logo />
      <div className='mt-12'>{children}</div>
    </div>
  );
};

export default AuthLayout;
