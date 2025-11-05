import SiteTabs from '@/components/SiteTabs';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <SiteTabs />
        {children}
      </body>
    </html>
  );
}
