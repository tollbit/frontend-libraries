import "./globals.css";
import { AI } from "./action";
import { Inter_Tight } from "next/font/google";

const Inter = Inter_Tight({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={Inter.className}>
        <AI>{children}</AI>
      </body>
    </html>
  );
}
