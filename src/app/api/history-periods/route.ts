import prisma from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = async (req: Request) => {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const periods = await getHistoryPeriods(user.id);

  return Response.json(periods);
};

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

const getHistoryPeriods = async (userId: string) => {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ['year'],
    orderBy: {
      year: 'asc',
    },
  });

  const years = result.map((r) => r.year);

  if (years.length === 0) {
    return [new Date().getFullYear()];
  }

  return years;
};
