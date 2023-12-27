import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mapa polskich lotnisk',
  description: 'Interaktywna mapa polskich lotnisk',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
