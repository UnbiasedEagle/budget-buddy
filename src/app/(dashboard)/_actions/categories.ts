'use server';

import prisma from '@/lib/db';
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from '@/schema/categories';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const createCategory = async (form: CreateCategorySchemaType) => {
  const parsedBody = CreateCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const { icon, name, type } = parsedBody.data;

  const category = await prisma.category.create({
    data: {
      userId: user.id,
      icon,
      name,
      type,
    },
  });

  return category;
};

export const deleteCategory = async (form: DeleteCategorySchemaType) => {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error('bad request');
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  return await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
};
