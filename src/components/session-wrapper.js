"use client";

import { SessionProvider, useSession } from "next-auth/react";
import Header from "./header";
import Footer from "./footer";
import { usePathname } from "next/navigation";

export default function SessionWrapper({ children }) {
  
  const HIDE_HEADER = ["/admin", "/register", "/login"];
  const pathname = usePathname();

  const pathIsRestricted = () => {
    let restricted = false;
    let i=0;

    while (!restricted && i < HIDE_HEADER.length) {
      restricted = pathname.includes(HIDE_HEADER[i]);
      i++;
    }
    return restricted;
  }

  const GetHeader = () => {
    const {data: session, status} = useSession();

    if (pathIsRestricted())
      return null;
    
    return <Header />
  }

  return (
    <SessionProvider>
      <div className="flex flex-col justify-between">
        <GetHeader />
        <div className={`flex flex-col ${!pathIsRestricted() ? "h-[calc(100dvh_-_96px)] mt-24" : "h-[100dvh]"}`}>
          {children}
          {!pathname.includes("/build/") &&
          <div className="mt-auto">
             <Footer />
          </div>
          }
        </div>
      </div>
    </SessionProvider>
  );
}