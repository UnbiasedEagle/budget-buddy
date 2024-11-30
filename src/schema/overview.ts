import { MAX_DATE_RANGE } from '@/lib/constants';
import { differenceInDays } from 'date-fns';
import { z } from 'zod';

export const OverviewSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((data) => {
    const { from, to } = data;
    const days = differenceInDays(to, from);
    const isValidDateRange = days >= 0 && days <= MAX_DATE_RANGE;
    return isValidDateRange;
  });
