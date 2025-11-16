import axios from "axios";
import { redirect } from "next/navigation";

import SearchDisplay from "@/components/search-display";

export default async function Search({params, searchParams}) {
    const targets = ["decks", "cards", "users"];

    const { target } = await params;
    const { name } = await searchParams;

    if (targets.includes(target) && name.length > 0) {
        const response = await axios.get(`${process.env.SERVER_URL}/${target}/search/${name}`);
    
        return <SearchDisplay target={target} data={response.data} name={name} />
    }
    else
        redirect("/");
}