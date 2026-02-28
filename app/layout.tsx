import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { QueryProvider } from "@/components/query-provider";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Purchase Organizer",
  description: "Organize your personal purchases",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <QueryProvider>
            <ToastProvider>{children}</ToastProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
