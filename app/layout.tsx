import "./globals.css";

export const metadata = {
  title: "AI at Work — Human Productivity ROI",
  description: "Brainster-themed ROI calculator and hero.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0b1022] antialiased">{children}</body>
    </html>
  );
}
