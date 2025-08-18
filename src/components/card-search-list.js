import { useEffect, useRef, useState } from "react"
import { useSearch } from "@/context/search-context";
import TCGdex, { Query } from "@tcgdex/sdk";
import { FaSpinner } from "react-icons/fa";
import CardSearchListElement from "./card-search-list-element";
import Pagination from "./pagination"
import { useDeckContext } from "@/context/deck-context";
import CardSearchFilters from "./card-search-filters";

export default function CardSearchList() {
     const {
        cards, deckError
    } = useDeckContext();

    const PER_PAGE = 12;

    const tcgdex = new TCGdex("en");

    const { search, setFilters, appliedFilters } = useSearch();

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

            const filters = await getFilters(cards);
            setFilters(filters);

            let timeout;
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                setCardList(cards);    
            }, 1500);
            
        }
        if (search.length > 0)
            doSearch();
    }, [search]);

    useEffect(() => {
        const updateSearch = async () => {
            setIsLoading(true);

            let setString = "";
            let catString = "";
            let stageString = "";
            let typeString = "";
            let legString = "";

            for (const af of appliedFilters) {
                switch (af.field.toLowerCase()) {
                    case "set":
                        setString += (setString.length > 0 ? `,${af.value}` : af.value)
                        break;
                    case "category":
                        catString += (catString.length > 0 ? `,${af.value}` : af.value)
                        break;
                    case "stage":
                        stageString += (stageString.length > 0 ? `,${af.value}` : af.value)
                        break;
                    case "type":
                        typeString += (typeString.length > 0 ? `,${af.value}` : af.value)
                        break;
                    case "legality":
                        legString += (legString.length > 0 ? `,${af.value}` : af.value)
                        break;
                    default:
                        break;
                    }
            }

            console.log(setString, catString, stageString, typeString, legString);

            const query = Query.create().like("name", search);

            if (catString.length > 0)
                query.equal("category", catString);
    
            const cards = await tcgdex.card.list(
                query
                .not.contains("localId", "tcgp")
                .sort("name", "ASC")
                .not.isNull("image")
            );
            
            setCardList(cards);
        }
        if (search.length > 0)
            updateSearch();
    }, [appliedFilters])

    useEffect(() => {
        setPageNumber(0);
        setIsLoading(false);
    }, [cardList])

    useEffect(() => {
        if (cardScrollRef.current && !isLoading)
            cardScrollRef.current.scrollTop = 0;
    }, [isLoading])

    const getFilters = async (cards) => {
        const sets = [];
        const categories = ["Pokemon", "Trainer", "Energy"];
        const stages = ["Basic", "Stage 1", "Stage 2", "V", "VMAX", "VSTAR", "ex"];
        const types = ["Grass", "Fire", "Water", "Lightning", "Psychic", "Fighting", "Darkness", "Metal", "Fairy", "Dragon", "Colorless"];
        const legality = ["Standard", "Expanded"];;

        for (let c of cards) {
            const setTokens = c.id.split("-");
            const id = setTokens[0];

            if (sets.findIndex((elem) => elem.id === id) < 0) {
                const set = await tcgdex.fetch("sets", id);
                if (set)
                    sets.push({
                        id,
                        name: set.name
                    })
            }
        }

        sets.sort((a,b) => {return a.name.localeCompare(b.name)})

        return [
            {
                field_name: "Set",
                field_options: sets
            },
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
                field_name: "Legality",
                field_options: legality
            },
        ]
    }
    
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
            <div ref={cardScrollRef} className="flex flex-col p-4 pt-0 flex-1">
                <CardSearchFilters />
                <div className="relative w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
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