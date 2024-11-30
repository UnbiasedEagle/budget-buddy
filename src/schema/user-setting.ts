import { z } from 'zod';
import { currencies } from '@/lib/currencies';

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((currency) => {
    const found = currencies.find((c) => c.value === currency);

    if (!found) {
      throw new Error(`Invalid currency: ${currency}`);
    }

    return currency;
  }),
});
