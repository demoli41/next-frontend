import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlavorAI',
  description: 'Personal Recipe Discovery Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar /> 
          <main className="container mx-auto  flex-grow"> 
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}