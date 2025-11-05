// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI at Work — Human Productivity ROI",
  description:
    "Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#0b1022] text-white">{children}</body>
    </html>
  );
}
