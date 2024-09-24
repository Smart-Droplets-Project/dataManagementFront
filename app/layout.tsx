// app/layout.tsx
import Navbar from './components/Navbar';
import '@/app/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ padding: '2rem' }}>{children}</main>
      </body>
    </html>
  );
}
