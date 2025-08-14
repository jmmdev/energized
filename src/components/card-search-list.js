import { useEffect, useRef, useState } from "react"
import { useSearch } from "@/context/search-context";
import TCGdex, { Query } from "@tcgdex/sdk";
import { FaSpinner } from "react-icons/fa";
import CardSearchListElement from "./card-search-list-element";
import Pagination from "./pagination"
import { useDeckContext } from "@/context/deck-context";

export default function CardSearchList() {
     const {
        cards, deckError
    } = useDeckContext();

    const PER_PAGE = 24;

    const tcgdex = new TCGdex("en");

    const { search, setSearch } = useSearch();

    const [cardList, setCardList] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);

    const cardScrollRef = useRef();

    useEffect(() => {
        const doSearch = async () => {
            setIsLoading(true);
    
            const cards = await tcgdex.card.list(
                Query.create().like("name", search)
                .not.contains("localId", "tcgp")
                .sort("name", "ASC")
                .not.isNull("image")
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
        setPageNumber(0);
        setIsLoading(false);
    }, [cardList])

    useEffect(() => {
        if (cardScrollRef.current && !isLoading)
            cardScrollRef.current.scrollTop = 0;
    }, [isLoading])

    
    const getCardQuantity = (elem) => {
        const position = cards.findIndex((card) => card.card.id === elem.id);
        
        if (position >= 0)
            return cards[position].quantity;
        
        return 0;
    }

    if (isLoading)
        return (
            <div className="flex-1 w-full flex flex-col p-4 gap-2 justify-center items-center opacity-70">
                <FaSpinner className="text-2xl animate-spin" />
                <p className="text-lg">
                    Searching cards...
                </p>
            </div>
        )

    if (cardList && cardList.length > 0) {

        const startIndex = pageNumber * PER_PAGE;
        const endIndex = startIndex + PER_PAGE;

        const subList = cardList.slice(startIndex, endIndex);

        return (
            <div ref={cardScrollRef} className="flex flex-col gap-4 overflow-auto">
                <div className="relative w-full grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 pr-2 gap-3 bt-1">
                    {
                        subList.map((elem) => {
                            if (elem.image) {
                                const quantity = getCardQuantity(elem);

                                return (
                                    <CardSearchListElement key={elem.id} elem={elem} quantity={quantity} />
                                )
                            }
                        })
                    }
                </div>
                <Pagination list={cardList} pageNumber={pageNumber} setPageNumber={setPageNumber} perPage={PER_PAGE} />
            </div>
        )
    }
    
        return (
            <div className="flex-1 w-full flex flex-col p-4 gap-2 justify-center items-center opacity-70">
                <p className={`text-lg ${deckError.show && "text-red-400"}`}>
                    {deckError.show
                        ? deckError.message
                        :
                            <>
                            {cardList 
                                ? `No card results for "${search}"` 
                                : 'Search any card by name\neg: "Pikachu"'
                            }
                            </>
                    }
                </p>
            </div>
        )
}