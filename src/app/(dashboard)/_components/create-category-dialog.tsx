'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from '@/schema/categories';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleOff, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ReactNode, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createCategory } from '../_actions/categories';

interface CreateCategoryDialogProps {
  type: TransactionType;
  onSuccessCallback: (category: Category) => void;
  trigger: ReactNode;
}

export const CreateCategoryDialog = ({
  type,
  onSuccessCallback,
  trigger,
}: CreateCategoryDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: '',
        icon: '',
        type,
      });

      toast.success(`Category ${data.name} created successfully 🎉`, {
        id: 'create-category',
      });

      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      });

      setOpen((prev) => !prev);

      onSuccessCallback(data);
    },
    onError() {
      toast.error('Something went wrong', {
        id: 'create-category',
      });
    },
  });

  const onSubmit = useCallback(
    (value: CreateCategorySchemaType) => {
      toast.loading('Creating category...', {
        id: 'create-category',
      });

      mutate(value);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create
            <span
              className={cn(
                'm-1',
                type === 'income' ? 'text-emerald-500' : 'text-rose-500'
              )}
            >
              {type}
            </span>
            category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transactions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input defaultValue='' {...field} />
                    </FormControl>
                    <FormDescription>
                      This is how your category will appear in the app
                    </FormDescription>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            className='h-[100px] w-full'
                          >
                            {form.watch('icon') ? (
                              <div className='flex flex-col items-center gap-2'>
                                <span className='text-5xl' role='img'>
                                  {field.value}
                                </span>
                                <p className='text-xs text-muted-foreground'>
                                  Click to change
                                </p>
                              </div>
                            ) : (
                              <div className='flex flex-col items-center gap-2'>
                                <CircleOff className='h-12 w-12' />
                                <p className='text-xs text-muted-foreground'>
                                  Click to select
                                </p>
                              </div>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-full'>
                          <Picker
                            onEmojiSelect={(emoji: { native: string }) => {
                              field.onChange(emoji.native);
                            }}
                            data={data}
                            theme={theme.resolvedTheme}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      This is how your category will appear in the app
                    </FormDescription>
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type='button'
              variant='secondary'
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={isPending} onClick={form.handleSubmit(onSubmit)}>
            {isPending && <Loader2 className='animate-spin' />}
            {!isPending && 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
