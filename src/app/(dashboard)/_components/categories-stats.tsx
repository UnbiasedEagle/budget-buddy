'use client';

import { GetCategoriesStatsResponseType } from '@/app/api/stats/categories/route';
import { SkeletonWrapper } from '@/components/skeleton-wrapper';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { convertToUTCDate, getFormatterForCurrency } from '@/lib/helpers';
import { TransactionType } from '@/lib/types';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

interface CategoriesStatsProps {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

export const CategoriesStats = ({
  userSettings,
  from,
  to,
}: CategoriesStatsProps) => {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ['overview', 'stats', 'categories', from, to],
    queryFn: async () => {
      const response = await fetch(
        `/api/stats/categories?from=${convertToUTCDate(
          from
        )}&to=${convertToUTCDate(to)}`
      );
      const data = await response.json();
      return data;
    },
  });

  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className='flex w-full flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type='income'
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type='expense'
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
};

const CategoriesCard = ({
  formatter,
  type,
  data,
}: {
  formatter: Intl.NumberFormat;
  type: TransactionType;
  data: GetCategoriesStatsResponseType;
}) => {
  const filteredData = data.filter((item) => item.type === type);
  const total = filteredData.reduce(
    (acc, item) => acc + (item._sum.amount || 0),
    0
  );

  return (
    <Card className='h-80 w-full col-span-6'>
      <CardHeader>
        <CardTitle className='text-muted-foreground'>
          {type === 'income' && (
            <span className='text-emerald-500'>Incomes</span>
          )}
          {type === 'expense' && (
            <span className='text-rose-500'>Expenses</span>
          )}{' '}
          by category
        </CardTitle>
      </CardHeader>
      <div className='flex gap-2 items-center justify-between'>
        {filteredData.length === 0 && (
          <div className='flex h-60 w-full flex-col items-center justify-center'>
            No data for the selected period
            <p className='text-sm text-muted-foreground'>
              Try selecting a different period or try adding new{' '}
              {type === 'income' ? 'incomes' : 'expenses'}
            </p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className='h-60 w-full px-4'>
            <div className='flex w-full flex-col gap-4 p-4'>
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className='flex flex-col gap-2'>
                    <div className='flex items-center gap-4 justify-between'>
                      <span className='flex items-center text-gray-400'>
                        {item.categoryIcon} {item.category}
                        <span className='ml-2 text-xs text-muted-foreground'>
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className='text-sm text-gray-400'>
                        {formatter.format(amount)}
                      </span>
                    </div>

                    <Progress
                      value={percentage}
                      indicator={
                        type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};
