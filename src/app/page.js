"use client";
import { useEffect, useState } from "react";
import Hero from "../components/hero";
import ListDisplay from "@/components/list-display";
import axios from "axios";
import { useSession } from "next-auth/react";
export default function Home() {

  const {data: session, status} = useSession();
  const [deckData, setDeckData] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);

       const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/decks/home`);
       setDeckData(response.data);
    }
    initialize();
  }, [])

  if (status !== "loading" && deckData)
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <Hero />
        <div className="w-full flex flex-col lg:flex-row flex-1 gap-6 sm:gap-12 p-6 sm:px-8 sm:py-12">
          <div className="w-full flex-1 lg:w-1/2">
            <ListDisplay list={deckData.recent} isHome name="Most recent" />
          </div>
          <div className="w-full flex-1 lg:w-1/2">
            <ListDisplay list={deckData.popular} isHome name="Most popular"/>
          </div>
        </div>
      </div>
    );
  
  return null;
}