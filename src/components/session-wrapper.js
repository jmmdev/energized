"use client";

import { SessionProvider, useSession } from "next-auth/react";
import Header from "./header";
import Footer from "./footer";
import { usePathname } from "next/navigation";

export default function SessionWrapper({ children }) {
  
  const HIDE_HEADER = ["/register", "/login", "/build"] 
  const pathname = usePathname();

  const GetHeader = () => {
    const {data: session, status} = useSession();

    if (pathname.includes("/admin") || !session && HIDE_HEADER.includes(pathname))
      return null;
    
    return <Header />
  }

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col justify-between">
        <GetHeader />
        <div className="mt-24 z-1">
          {children}
        </div>
        <Footer />
      </div>
    </SessionProvider>
  );
}