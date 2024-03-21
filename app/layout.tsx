import '@/app/ui/global.css';
import { infer } from './ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${infer.className} antialiased`}>{children}</body>
    </html>
  );
}
