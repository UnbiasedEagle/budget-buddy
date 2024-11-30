import prisma from '@/lib/db';
import { OverviewSchema } from '@/schema/overview';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const GET = async (req: Request) => {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const { searchParams } = new URL(req.url);

  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const parsedResult = OverviewSchema.safeParse({
    from,
    to,
  });

  if (!parsedResult.success) {
    return Response.json(parsedResult.error.message, { status: 400 });
  }

  const stats = await getBalanceStats(
    user.id,
    parsedResult.data.from,
    parsedResult.data.to
  );

  return Response.json(stats);
};

export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;

const getBalanceStats = async (userId: string, from: Date, to: Date) => {
  const totals = await prisma.transaction.groupBy({
    by: ['type'],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    expense: totals.find((t) => t.type === 'expense')?._sum.amount || 0,
    income: totals.find((t) => t.type === 'income')?._sum.amount || 0,
  };
};
