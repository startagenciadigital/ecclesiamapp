import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { LiturgicalProvider } from "@/components/providers/LiturgicalProvider";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fontSerif = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_TENANT_NAME 
    ? `${process.env.NEXT_PUBLIC_TENANT_NAME} - Rede Social Católica` 
    : "Rede Social de Paróquias",
  description: "A rede social para conectar paróquias e fiéis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fontSans.variable} ${fontSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <LiturgicalProvider>
          {children}
        </LiturgicalProvider>
      </body>
    </html>
  );
}
