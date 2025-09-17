"use client";

import { SessionProvider } from "next-auth/react";
import Header from "./header";
import Footer from "./footer";
import { usePathname } from "next/navigation";

export default function SessionWrapper({ children }) {
  
  const HIDE_HEADER = ["/admin", "/register", "/login"];
  const HIDE_FOOTER = ["/build", "/deck"];
  const SIMPLE_HEADER = ["/build"];
  const pathname = usePathname();

  const getPathType = () => {
    if (searchPathInList(HIDE_HEADER))
      return "restricted";

    if (searchPathInList(SIMPLE_HEADER))
      return "simplified";
  }

  const searchPathInList = (pathList) => {
    let pathFound = false;
    
    let i=0;

    while (!pathFound && i < pathList.length) {
      if (pathname.includes(pathList[i]))
        pathFound = true;
      
      i++;
    }

    return pathFound;
  }

  const GetHeader = () => {
    if (getPathType() === "restricted")
      return null;
    
    return <Header />
  }

  const getContentMargin = () => {
    switch (getPathType()) {
      case "restricted":
        return "h-[100dvh]"
      case "simplified":
        return "h-[calc(100dvh_-_48px)] mt-12";
      default:
        return "h-[calc(100dvh_-_96px)] mt-24";
    }
  }

  return (
    <SessionProvider>
      <div className="flex flex-col justify-between">
        <GetHeader />
        <div className={`flex flex-col ${getContentMargin()}`}>
          {children}
          {!searchPathInList(HIDE_FOOTER) &&
          <div className="mt-auto">
             <Footer />
          </div>
          }
        </div>
      </div>
    </SessionProvider>
  );
}