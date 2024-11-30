'use client';

import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route';
import { SkeletonWrapper } from '@/components/skeleton-wrapper';
import { Card } from '@/components/ui/card';
import { convertToUTCDate, getFormatterForCurrency } from '@/lib/helpers';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import CountUp from 'react-countup';

interface StatsCardsProps {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

export const StatsCards = ({ userSettings, from, to }: StatsCardsProps) => {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ['overview', 'stats', from, to],
    queryFn: async () => {
      const response = await fetch(
        `/api/stats/balance?from=${convertToUTCDate(
          from
        )}&to=${convertToUTCDate(to)}`
      );
      const data = await response.json();
      return data;
    },
  });

  const formatter = useMemo(
    () => getFormatterForCurrency(userSettings.currency),
    [userSettings.currency]
  );

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  const balance = income - expense;

  return (
    <div className='relative flex w-full flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title='Income'
          icon={
            <TrendingUp className='h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10' />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title='Expense'
          icon={
            <TrendingDown className='h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10' />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title='Balance'
          icon={
            <Wallet className='h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10' />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  formatter,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  formatter: Intl.NumberFormat;
}) => {
  const formatterFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className='flex h-24 w-full items-center gap-2 p-4'>
      {icon}
      <div className='flex flex-col items-start gap-0'>
        <p className='text-muted-foreground'>{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatterFn}
          className='text-2xl'
        />
      </div>
    </Card>
  );
};
