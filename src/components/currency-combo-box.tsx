'use client';

import { updateUserCurrency } from '@/app/wizard/_actions/user-settings';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMediaQuery } from '@/hooks/use-media-query';
import { currencies, Currency } from '@/lib/currencies';
import { UserSettings } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { SkeletonWrapper } from './skeleton-wrapper';
import { DialogTitle } from './ui/dialog';

export const CurrencyComboBox = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [option, setOption] = useState<Currency | null>(null);

  const userSettings = useQuery<UserSettings>({
    queryKey: ['user-settings'],
    queryFn: async () => {
      const response = await fetch('/api/user-settings');
      return response.json();
    },
  });

  useEffect(() => {
    if (userSettings.data?.currency) {
      const userCurrency = currencies.find(
        (currency) => currency.value === userSettings.data.currency
      );

      if (userCurrency) {
        setOption(userCurrency);
      }
    }
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationFn: updateUserCurrency,
    onSuccess: (data) => {
      toast.success('Currency updated successfully 🎉', {
        id: 'update-currency',
      });
      setOption(
        currencies.find((currency) => currency.value === data.currency) || null
      );
    },
    onError: () => {
      toast.error('Something went wrong', {
        id: 'update-currency',
      });
    },
  });

  const selectOption = useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error('Please select a currency');
        return;
      }

      toast.loading('Updating currency...', {
        id: 'update-currency',
      });

      mutation.mutate(currency.value);
    },
    [mutation]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              disabled={mutation.isPending}
              variant='outline'
              className='w-full justify-start'
            >
              {option ? <>{option.label}</> : <>Set Currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0' align='start'>
            <CurrencyList setOpen={setOpen} setOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            disabled={mutation.isPending}
            variant='outline'
            className='w-full justify-start'
          >
            {option ? <>{option.label}</> : <>Set Currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DialogTitle className='sr-only'>Set Currency</DialogTitle>
          <div className='mt-4 border-t'>
            <CurrencyList setOpen={setOpen} setOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
};

function CurrencyList({
  setOpen,
  setOption,
}: {
  setOpen: (open: boolean) => void;
  setOption: (currency: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder='Filter currency...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {currencies.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setOption(
                  currencies.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
