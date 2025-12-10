import { Outfit } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/session-wrapper";
import { ThemeProvider } from "@/context/theme-context";
import { NavigationProvider } from "@/context/navigation-context";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "energized",
  description: "Build. Battle. Win.",
};

export default function RootLayout({ children }) {
  
  return (
      <html lang="en">
        <body className={`${outfit.variable} my-scrollbar antialiased`}>
          <NavigationProvider>
            <ThemeProvider>
              <SessionWrapper>
                {children}
              </SessionWrapper>
            </ThemeProvider>
          </NavigationProvider>
        </body>
      </html>
  );
}