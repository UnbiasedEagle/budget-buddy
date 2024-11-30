'use client';

import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo, LogoMobile } from './logo';
import { Button, buttonVariants } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
};

const items = [
  { label: 'Dashboard', link: '/' },
  { label: 'Transactions', link: '/transactions' },
  { label: 'Manage', link: '/manage' },
];

const DesktopNavbar = () => {
  return (
    <div className='hidden border-separate border-b bg-background md:block'>
      <nav className='container mx-auto flex items-center justify-between px-8'>
        <div className='flex h-[80px] min-h-[60px] items-center gap-x-4'>
          <Logo />
          <div className='flex h-full'>
            {items.map((item, index) => (
              <NavbarItem key={index} link={item.link} label={item.label} />
            ))}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <UserButton />
        </div>
      </nav>
    </div>
  );
};

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='border border-separate bg-background md:hidden'>
      <nav className='container mx-auto flex items-center justify-between px-8'>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className='w-[400px] sm:w-[540px]' side='left'>
            <Logo />
            <div className='flex flex-col gap-1 pt-4'>
              {items.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  onClick={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className='flex h-[80px] min-h-[60px] items-center gap-x-4'>
          <LogoMobile />
        </div>
        <div className='flex items-center gap-2'>
          <UserButton />
        </div>
      </nav>
    </div>
  );
};

const NavbarItem = ({
  link,
  label,
  onClick,
}: {
  link: string;
  label: string;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className='relative flex items-center'>
      <Link
        className={cn(
          buttonVariants({
            variant: 'ghost',
          }),
          'w-full justify-start text-lg text-muted-foreground hover:text-foreground',
          isActive && 'text-foreground'
        )}
        href={link}
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className='absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block'></div>
      )}
    </div>
  );
};
