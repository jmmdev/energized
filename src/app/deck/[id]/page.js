import axios from "axios";
import DeckData from "@/components/deck-data";

export default async function Deck({params}) {
    const { id } = await params;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/decks?id=${id}`);

    return (
        <DeckData data={response.data} />
    )
}