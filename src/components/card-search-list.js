import { useEffect, useState } from "react"
import { useSearch } from "@/context/search-context";
import TCGdex, { Query } from "@tcgdex/sdk";
import { FaSpinner } from "react-icons/fa";
import CardSearchListElement from "./card-search-list-element";
import Pagination from "./pagination"
import { useDeckContext } from "@/context/deck-context";

export default function CardSearchList({cardScrollRef}) {
     const {
        cards, deckError
    } = useDeckContext();

    const PER_PAGE = 24;

    const tcgdex = new TCGdex("en");

    const { search, setFilters, appliedFilters, isSearching, setIsSearching, trigger } = useSearch();

    const [cardList, setCardList] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);

    useEffect(() => {
        const categories = ["Pokemon","Trainer","Energy"];
        const stages = ["Basic","Stage1","Stage2","VMAX","VSTAR","MEGA","V-UNION","BREAK","RESTORED","LEVEL-UP"];
        const types = require("public/assets/files/energy-types.json");
        const legal = ["Standard", "Expanded"];

        setFilters(
            [
                {
                    field_name: "Category",
                    field_options: categories
                },
                {
                    field_name: "Stage",
                    field_options: stages
                },
                {
                    field_name: "Type",
                    field_options: types
                },
                {
                    field_name: "Legal",
                    field_options: legal
                },
            ]
        )
    }, [])

    useEffect(() => {
        const doSearch = async () => {
            setIsSearching(true);

            let catString = "";
            let stageString = "";
            let typeString = "";
            let legalTokens = [];

            for (const af of appliedFilters) {
                switch (af.field.toLowerCase()) {
                    case "category":
                        catString += (catString.length > 0 ? `,${af.value}` : af.value)
                        break;
                    case "stage":
                        stageString += (stageString.length > 0 ? `,${af.value}` : af.value)
                        break;
                    case "type":
                        typeString += (typeString.length > 0 ? `,${af.value}` : af.value)
                        break;
                    case "legal":
                        legalTokens.push(af.value)
                        break;
                    default:
                        break;
                    }
            }

            const query = Query.create().like("name", search);

            if (catString.length > 0)
                query.like("category", catString);

            if (stageString.length > 0)
                query.like("stage", stageString.replace(" ", ""));

            if (typeString.length > 0)
                query.like("types", typeString);

            for (const t of legalTokens)
                query.like(`legal.${t.toLowerCase()}`, "true");

    
            const cards = await tcgdex.card.list(
                query
                .not.isNull("image")
                .not.contains("image", "tcgp")
                .sort("name", "ASC")
            );
            
            setCardList(cards);
        }
        if (search.length > 0)
            doSearch();
    }, [search, trigger])

    useEffect(() => {
        let timeout;
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            setPageNumber(0);
            setIsSearching(false);
        }, 1500);
    }, [cardList])

    useEffect(() => {
        if (cardScrollRef.current && !isSearching)
            cardScrollRef.current.scrollTop = 0;
    }, [isSearching])
    
    const getCardQuantity = (elem) => {
        const position = cards.findIndex((card) => card.card.id === elem.id);
        
        if (position >= 0)
            return cards[position].quantity;
        
        return 0;
    }

    if (isSearching)
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
            <div className="w-full flex flex-col gap-4 overflow-y-auto search-scrollbar mb-16">
                <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 px-12 lg:px-4 gap-12 lg:gap-4">
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
                {cardList.length > PER_PAGE && <Pagination list={cardList} pageNumber={pageNumber} setPageNumber={setPageNumber} perPage={PER_PAGE} />}
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