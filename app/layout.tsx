'use client';

import { cn } from '@/lib/utils';
import { Nunito } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Footer } from './_components/footer';
import './globals.css';

const font = Nunito({ subsets: ['latin'] });

type Props = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <html lang='en'>
      <body
        className={cn(
          'relative w-full h-full min-h-screen text-neutral-100 bg-neutral-900',
          font.className
        )}
      >
        {children}

        <Footer />

        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
