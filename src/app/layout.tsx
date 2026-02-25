import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap'
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap'
});

const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "ContractAI - AI-Powered Smart Contract Studio",
  description:
    "Professional AI models for writing and auditing smart contracts. Build secure, production-ready blockchain applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} font-sans`}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  );
}
