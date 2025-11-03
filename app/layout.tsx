export const metadata = {
  title: 'AI at Work — Human Productivity ROI',
  description: 'Estimate time saved, payback and ROI from upskilling teams on AI.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
