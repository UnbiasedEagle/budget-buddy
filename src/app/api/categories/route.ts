import prisma from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const GET = async (req: Request) => {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const { searchParams } = new URL(req.url);

  const paramType = searchParams.get('type');

  const validator = z.enum(['income', 'expense']).nullable();

  const parsedResult = validator.safeParse(paramType);

  if (!parsedResult.success) {
    return Response.json(parsedResult.error, { status: 400 });
  }

  const type = parsedResult.data;

  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      type: type || undefined,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return Response.json(categories);
};
