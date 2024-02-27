import './global.css';

export const metadata = {
  title: 'Welcome to Admin',
  description: 'Dashboard application for managing products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}