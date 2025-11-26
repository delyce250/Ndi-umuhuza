import type { Metadata } from "next";
import { Pacifico } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
});

export const metadata: Metadata = {
  title: "Ndi Umuhuza - Rwanda Nutrition Connect",
  description: "Data-driven solutions for sustainable nutrition and food security in Rwanda",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={pacifico.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body className={`${pacifico.variable} font-sans`}>
        {children}
        <Script 
          src="https://readdy.ai/api/public/assistant/widget?projectId=ca0f164e-c95e-49ae-98f4-9b448e93b58b"
          strategy="afterInteractive"
          data-mode="chat"
          data-theme="light"
          data-size="compact"
          data-accent-color="#C7D59F"
          data-button-base-color="#40531A"
          data-button-accent-color="#FFFFFF"
          data-main-label="Nutrition Assistant"
          data-empty-chat-message="Ask me about Rwanda nutrition data, stunting rates, or book a consultation!"
        />
      </body>
    </html>
  )
}
