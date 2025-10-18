"use client";

import { SessionProvider } from "next-auth/react";
import Header from "./header";
import Footer from "./footer";
import { usePathname } from "next/navigation";

export default function SessionWrapper({ children }) {
  
  const HIDE_HEADER = ["/admin", "/register", "/login"];
  const HIDE_FOOTER = ["/build", "/deck"];
  const pathname = usePathname();

  const searchPathInList = (pathList) => {
    let pathFound = false;
    
    let i=0;

    while (!pathFound && i < pathList.length) {
      if (!pathname.includes("/search") && pathname.includes(pathList[i]))
        pathFound = true;
      i++;
    }

    return pathFound;
  }

  const isBuild = pathname.includes("/build");

  const showHeader = !isBuild && !searchPathInList(HIDE_HEADER);
  const showFooter = !searchPathInList(HIDE_FOOTER);

  return (
    <SessionProvider>
        {showHeader && <Header />}
        <div className={`flex flex-col ${(showHeader || isBuild) && "mt-24"}`}>
          {children}
          {showFooter &&
            <div className="mt-auto">
              <Footer />
            </div>
          }
        </div>
    </SessionProvider>
  );
}