import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { CurrencyProvider } from '@/src/components/CurrencyContext';

export const metadata: Metadata = {
  title: 'SyntaxHost | Premium SaaS Hosting',
  description: 'High-performance VPS, VDS, and Minecraft hosting.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-50 min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <CurrencyProvider>
          {children}
          <Toaster theme="dark" position="top-right" />
        </CurrencyProvider>
      </body>
    </html>
  );
}
