'use server';

import prisma from '@/lib/db';
import { UpdateUserCurrencySchema } from '@/schema/user-setting';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const updateUserCurrency = async (currency: string) => {
  const parsedBody = UpdateUserCurrencySchema.safeParse({
    currency,
  });

  if (!parsedBody.success) {
    throw parsedBody.error.message;
  }

  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const userSettings = await prisma.userSettings.update({
    where: {
      userId: user.id,
    },
    data: {
      currency: parsedBody.data.currency,
    },
  });

  return userSettings;
};
