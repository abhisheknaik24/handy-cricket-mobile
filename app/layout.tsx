'use client';

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Nunito } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Loader } from './_components/loader';
import './globals.css';

const Footer = dynamic(
  () => import('./_components/footer').then((mod) => mod?.Footer),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const font = Nunito({ subsets: ['latin'] });

type Props = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <html lang='en'>
      <body
        className={cn(
          'relative w-full h-full min-h-screen max-w-screen-md mx-auto text-neutral-100 bg-neutral-900 overflow-x-hidden overflow-y-auto',
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
