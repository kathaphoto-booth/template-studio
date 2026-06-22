import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATELIER | Inquire',
  description: 'Commission a bespoke Katha Booth installation.',
};

export default function InquireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-sans antialiased text-[#0F0F0F] bg-[#FBFBF9] min-h-[100dvh]">
      {children}
    </div>
  );
}
