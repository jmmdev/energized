import { useEffect, useState } from "react"
import { useSearch } from "@/context/search-context";
import TCGdex, { Query } from "@tcgdex/sdk";
import { FaSpinner } from "react-icons/fa";
import CardSearchListElement from "./card-search-list-element";
import { useDeckContext } from "@/context/deck-context";

export default function CardSearchList() {
     const {
        name, setName, cards, setCards, image, setImage, legal, setLegal, hasChanges, setHasChanges, addCard, removeCard, cardQuantityRef
    } = useDeckContext();
    const tcgdex = new TCGdex("en");

    const { search, setSearch } = useSearch();

    const [cardList, setCardList] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const doSearch = async () => {
            setIsLoading(true);
            const searchLower = search.toLowerCase();

            const searchSplit = searchLower.split(" ");

            let searchCapitalize = "";

            for (let [index, word] of searchSplit.entries()) {
                const capitalizedWord = word[0].toUpperCase() + word.substring(1);
                searchCapitalize += word === "ex" ? "ex" : capitalizedWord;
                if (index < searchSplit.length - 1)
                    searchCapitalize += " ";
            }
    
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

    
    const getCardStartingQuantity = (elem) => {
        const position = cards.findIndex((card) => card.card.id === elem.id);
        if (position >= 0)
            return cards[position].quantity;
        else
            return 0;
    }

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
            <div className="w-full grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 pt-4 pr-2 gap-3 flex-wrap overflow-auto">
                {
                    cardList.map((elem) => {
                        if (elem.image) {
                            const quantity = getCardStartingQuantity(elem);

                            return (
                                <CardSearchListElement key={elem.id} elem={elem} initialQuantity={quantity} />
                            )
                        }
                    })
                }
            </div>
        )
    
        return (
            <div className="w-full h-full flex justify-center p-4">
                <p className="text-lg opacity-70 capitalize">
                    {cardList ? "no card results" : `Search any card by name\neg: "Pikachu"`}
                </p>
            </div>
        )
}