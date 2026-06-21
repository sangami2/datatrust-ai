import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CopilotWidget } from "@/components/copilot/CopilotWidget";

export const metadata: Metadata = {
  title: "DataTrust AI — Know which data products are ready to power AI",
  description: "Monitor AI readiness, prioritize data-product improvements, and unblock high-value analytics and machine-learning initiatives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full" style={{ background: "#faf9f6" }}>
        <Sidebar />
        <TopBar />
        <main className="ml-60 pt-14 min-h-full">
          {children}
        </main>
        <CopilotWidget />
      </body>
    </html>
  );
}
