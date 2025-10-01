import axios from "axios";
import SearchDisplay from "@/components/search-display";

export default async function Search({params, searchParams}) {
    const { target } = await params;
    const { name } = await searchParams;

    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/${target}/search/${name}`);
    
    return <SearchDisplay target={target} data={response.data} name={name} />
}