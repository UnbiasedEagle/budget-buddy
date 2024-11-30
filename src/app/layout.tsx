import { RootProvider } from '@/providers/root-provider';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: 'BudgetBuddy - Your Personal Budget Tracker',
  description:
    'Track your expenses, set budgets, and manage your finances with BudgetBuddy.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl='/sign-in'>
      <html
        className='dark'
        style={{
          colorScheme: 'dark',
        }}
        lang='en'
        suppressHydrationWarning
      >
        <body className={`${roboto.className} antialiased`}>
          <Toaster richColors position='bottom-right' />
          <RootProvider>{children}</RootProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
