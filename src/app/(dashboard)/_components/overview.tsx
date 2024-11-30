'use client';

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE } from '@/lib/constants';
import { UserSettings } from '@prisma/client';
import { differenceInDays, startOfMonth } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { StatsCards } from './stats-cards';
import { CategoriesStats } from './categories-stats';

interface OverviewProps {
  userSettings: UserSettings;
}

export const Overview = ({ userSettings }: OverviewProps) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className='flex flex-wrap container mx-auto px-8 items-end justify-between py-6'>
        <h2 className='text-3xl font-bold'>Overview</h2>
        <div className='flex items-center gap-3'>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={({ range }) => {
              const { from, to } = range;
              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE) {
                toast.error(
                  `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE} days!`
                );
              }

              setDateRange({ from: from, to: to });
            }}
          />
        </div>
      </div>
      <div className='container mx-auto px-8 flex flex-col gap-2'>
        <StatsCards
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
        <CategoriesStats
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
    </>
  );
};
