import { Mulish } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/Providers';

const mulish = Mulish({ subsets: ['latin'] });

export const metadata = {
  title: 'The map of Polish airports',
  description: 'An interactive map of Polish airports',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={mulish.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
