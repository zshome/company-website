import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CompanyProvider } from "@/contexts/CompanyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "福建省宜然焕新科技有限公司 - 三棵树马上住焕新服务",
  description: "福建省宜然焕新科技有限公司专注于三棵树马上住焕新业务，为您提供专业的墙面翻新、旧房改造服务",
  keywords: "三棵树,马上住,焕新,墙面翻新,旧房改造,福建,宜然焕新",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <CompanyProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CompanyProvider>
      </body>
    </html>
  );
}
