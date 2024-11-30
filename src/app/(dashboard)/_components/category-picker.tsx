'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TransactionType } from '@/lib/types';
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { CreateCategoryDialog } from './create-category-dialog';
import { Check, ChevronsUpDown, PlusSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryPickerProps {
  type: TransactionType;
  onChange: (category: string) => void;
}

export const CategoryPicker = ({ type, onChange }: CategoryPickerProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const categoryQuery = useQuery<Category[]>({
    queryKey: ['categories', type],
    queryFn: async () => {
      const response = await fetch(`/api/categories?type=${type}`);
      return response.json();
    },
  });

  const selectedCategory = categoryQuery.data?.find(
    (category: Category) => category.name === value
  );

  const onSuccessCallback = useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setOpen, setValue]
  );

  useEffect(() => {
    if (!value) return;

    onChange(value);
  }, [value, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            'Select category'
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder='Search category...' />
          <CreateCategoryDialog
            onSuccessCallback={onSuccessCallback}
            type={type}
            trigger={
              <Button
                variant='ghost'
                className='flex border-separate items-center justify-start border-none border-b p-3 text-muted-foreground'
              >
                <PlusSquare className='mr-2 h-4 w-4' />
                Create new
              </Button>
            }
          />
          <CommandEmpty>
            <p>Category not found</p>
            <p className='text-xs text-muted-foreground'>
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoryQuery.data?.map((category) => {
                return (
                  <CommandItem
                    onSelect={() => {
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}
                    key={category.name}
                  >
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        'ml-2 w-4 h-4 opacity-0',
                        value === category.name && 'opacity-100'
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CategoryRow = ({ category }: { category: Category }) => {
  return (
    <div className='flex items-center gap-2'>
      <span role='img'>{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
};
