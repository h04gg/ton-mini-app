"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>TON Connect Demo</title>
      </head>
      <body>
        <TonConnectUIProvider manifestUrl="https://rose-left-whippet-164.mypinata.cloud/ipfs/QmSZ7XzGwyH4kppSPBS6VkHWToyuWBKKtJccAWKhB1HuUb">
          {children}
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
