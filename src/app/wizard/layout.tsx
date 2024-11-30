import { PropsWithChildren } from 'react';

const WizardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='relative flex h-screen w-full flex-col items-center justify-center'>
      {children}
    </div>
  );
};

export default WizardLayout;
