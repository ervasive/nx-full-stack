import { fonts } from '@/admin-ui';
import '@/admin-ui/global-styles.css';

export const metadata = {
  title: 'Welcome to Storefront',
  description: 'Storefront application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{ background: 'black' }}
        className={`${fonts.base.variable} ${fonts.mono.variable} dark`}
      >
        {children}
      </body>
    </html>
  );
}
