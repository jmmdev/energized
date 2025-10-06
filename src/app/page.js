import HomeData from "@/components/home-data";
import axios from "axios";

export default async function Home() {

      const response = await axios.get(`${process.env.SERVER_URL}/decks/home`);

      return (
        <HomeData deckData={response.data} />
      )
  }