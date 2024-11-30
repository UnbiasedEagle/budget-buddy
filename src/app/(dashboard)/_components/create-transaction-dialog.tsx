'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from '@/schema/transaction';
import { PropsWithChildren, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CategoryPicker } from './category-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '../_actions/transactions';
import { toast } from 'sonner';
import { convertToUTCDate } from '@/lib/helpers';

interface CreateTransactionDialogProps {
  type: TransactionType;
}

export const CreateTransactionDialog = ({
  children,
  type,
}: PropsWithChildren<CreateTransactionDialogProps>) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      date: new Date(),
      type,
    },
  });

  const handleCategoryChange = useCallback(
    (category: string) => {
      form.setValue('category', category);
    },
    [form]
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success('Transaction created successfully 🎉', {
        id: 'create-transaction',
      });

      form.reset({
        type,
        description: '',
        amount: 0,
        date: new Date(),
        category: undefined,
      });

      queryClient.invalidateQueries({
        queryKey: ['overview'],
      });

      setOpen((prev) => !prev);
    },
  });

  const onSubmit = useCallback(
    (value: CreateTransactionSchemaType) => {
      toast.loading('Creating transaction...', {
        id: 'create-transaction',
      });

      mutate({
        ...value,
        date: convertToUTCDate(value.date),
      });
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new
            <span
              className={cn(
                'm-1',
                type === 'income' ? 'text-emerald-500' : 'text-rose-500'
              )}
            >
              {type}
            </span>
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input defaultValue='' {...field} />
                    </FormControl>
                    <FormDescription>
                      Transaction description (optional)
                    </FormDescription>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type='number' defaultValue={0} {...field} />
                    </FormControl>
                    <FormDescription>
                      Transaction amount (required)
                    </FormDescription>
                  </FormItem>
                );
              }}
            />
            <div className='flex justify-between gap-2'>
              <FormField
                control={form.control}
                name='category'
                render={() => {
                  return (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <CategoryPicker
                          onChange={handleCategoryChange}
                          type={type}
                        />
                      </FormControl>
                      <FormDescription>
                        Select a category for this transaction
                      </FormDescription>
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='date'
                render={({ field }) => {
                  return (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Transaction date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              className={cn(
                                'w-[200px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                              variant='outline'
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select a date for this transaction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
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
