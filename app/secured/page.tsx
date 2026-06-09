import { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Request Received | Katha Booth',
  description: 'Your inquiry has been securely submitted.',
};

export default function SecuredPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#E8E2D9] blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E8E2D9] blur-3xl mix-blend-multiply" />
      </div>

      <div className="max-w-2xl mx-auto space-y-8 relative z-10 bg-white/40 p-12 rounded-3xl border border-[#E8E2D9]/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-sm">
        <div className="w-16 h-16 mx-auto mb-8 relative">
          <div className="absolute inset-0 border-[1.5px] border-[#3A3A3A] rounded-full opacity-20" />
          <svg className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#3A3A3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className={`${playfair.className} text-4xl md:text-5xl text-[#3A3A3A] font-medium tracking-tight`}>
          Request Received
        </h1>
        
        <div className="w-12 h-[1px] bg-[#3A3A3A]/20 mx-auto" />

        <div className={`${inter.className} space-y-4 text-[#5A5A5A] text-lg leading-relaxed max-w-lg mx-auto font-light`}>
          <p>Thank you for choosing Katha Booth.</p>
          <p>Your request has been securely submitted.</p>
          <p className="pt-2 font-medium text-[#3A3A3A]">Katha will be in touch with you momentarily.</p>
        </div>
      </div>
    </div>
  );
}
