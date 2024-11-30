import { PropsWithChildren } from 'react';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonWrapperProps {
  isLoading: boolean;
  fullWidth?: boolean;
}

export const SkeletonWrapper = ({
  children,
  fullWidth = true,
  isLoading,
}: PropsWithChildren<SkeletonWrapperProps>) => {
  if (!isLoading) {
    return children;
  }

  return (
    <Skeleton className={cn(fullWidth && 'w-full')}>
      <div className='opacity-0'>{children}</div>
    </Skeleton>
  );
};
