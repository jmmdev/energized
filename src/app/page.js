"use client";
import { useEffect, useState } from "react";
import Hero from "../components/hero";
import ListDisplay from "@/components/list-display";
import axios from "axios";
export default function Home() {

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

  useEffect(() => {
    console.log(deckData)
  }, [deckData])

  if (deckData)
    return (
      <>
        <Hero />
        <div className="w-full flex flex-col lg:flex-row flex-1 gap-12 px-8 py-12">
          <div className="w-full lg:w-1/2">
            <ListDisplay list={deckData.recent} isHome name="Most recent" />
          </div>
          <div className="w-full lg:w-1/2">
            <ListDisplay list={deckData.popular} isHome name="Most popular"/>
          </div>
        </div>
      </>
    );
  
  return null;
}