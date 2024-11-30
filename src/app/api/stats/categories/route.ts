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

  const stats = await getCategoriesStats(
    user.id,
    parsedResult.data.from,
    parsedResult.data.to
  );

  return Response.json(stats);
};

export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

const getCategoriesStats = async (userId: string, from: Date, to: Date) => {
  const stats = await prisma.transaction.groupBy({
    by: ['type', 'category', 'categoryIcon'],
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
    orderBy: {
      _sum: {
        amount: 'desc',
      },
    },
  });

  return stats;
};
