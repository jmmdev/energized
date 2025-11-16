"use client";
import { useSession } from "next-auth/react";
import Hero from "../components/hero";
import ListDisplay from "../components/list-display";
import { useEffect } from "react";
import Footer from "./footer";

export default function HomeData({deckData}) {

  const {data: session, status} = useSession();

  useEffect(() => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  }, [])

  if (status !== "loading")
      return (
        <div className="flex flex-col flex-1 overflow-x-hidden">
          <Hero />
          <div className="w-full flex-1 flex flex-col items-center">
            <div className="w-full max-w-[1920px] flex flex-col lg:flex-row flex-1 gap-6 sm:gap-12 p-6 xl:p-12">
              <div className="w-full flex-1 lg:w-1/2">
                <ListDisplay list={deckData.recent} isHome name="Most recent" />
              </div>
              <div className="w-full flex-1 lg:w-1/2">
                <ListDisplay list={deckData.popular} isHome name="Most popular"/>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    
    return null;
}