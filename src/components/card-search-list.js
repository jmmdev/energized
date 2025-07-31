import Image from "next/image"
import { useEffect, useState } from "react"
import { useSearch } from "@/context/search-context";
import TCGdex, { Query } from "@tcgdex/sdk";
import { FaSpinner } from "react-icons/fa";

export default function CardSearchList() {
    const tcgdex = new TCGdex("en");

    const { search, setSearch } = useSearch();

    const [cardList, setCardList] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const doSearch = async () => {
            setIsLoading(true);
            const searchLower = search.toLowerCase();
            const searchCapitalize = searchLower[0].toUpperCase() + searchLower.substring(1);
    
            const cards = await tcgdex.card.list(
                Query.create().equal("name", searchCapitalize)
            );

            let timeout;
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                setCardList(cards);    
            }, 1500);
            
        }
        if (search.length > 0)
            doSearch();
    }, [search])

    useEffect(() => {
        setIsLoading(false);
    }, [cardList])

    if (isLoading)
        return (
            <div className="w-full h-full flex flex-col p-4 gap-2 items-center opacity-70">
                <FaSpinner className="text-2xl animate-spin" />
                <p className="text-lg capitalize">
                    Searching Cards...
                </p>
            </div>
        )

    if (cardList && cardList.length > 0)
        return (
            <div className="w-full grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 pt-4 pr-2 gap-2 flex-wrap overflow-auto">
                {
                    cardList.map((elem, index) => {
                        if (elem.image)
                            return (
                                <div key={elem.id} className="w-full relative">
                                    <Image className="object-contain" priority src={elem.image + "/low.webp"}
                                    width={500} height={500}alt={`${elem.name}#${elem.id}`} />
                                </div>
                            )
                    })
                }
            </div>
        )
    
        return (
            <div className="w-full h-full flex justify-center">
                <p className="text-lg opacity-70 capitalize">
                    {cardList ? "no card results" : `Search any card by name\neg: "Pikachu"`}
                </p>
            </div>
        )
}