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

    const PER_PAGE = 12;

    const tcgdex = new TCGdex("en");

    const { search, setFilters, appliedFilters, isSearching, setIsSearching } = useSearch();

    const [cardList, setCardList] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);

    useEffect(() => {
        const doSearch = async () => {
            const filterList = document.getElementById("filter-list")
            
            if (filterList)
                filterList.removeAttribute("open");
            
            setIsSearching(true);
    
            const cards = await tcgdex.card.list(
                Query.create().like("name", search)
                .not.isNull("image")
                .not.contains("image", "tcgp")
                .sort("name", "ASC")
            );

            const filters = await getFilters(cards);

            setFilters(filters);
            setCardList(cards);
            
        }
        if (search.length > 0)
            doSearch();
    }, [search]);

    useEffect(() => {
        const updateSearch = async () => {
            setIsSearching(true);

            let setString = "";
            let catString = "";
            let stageString = "";
            let typeString = "";
            let legalTokens = [];

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
                    case "legal":
                        legalTokens.push(af.value)
                        break;
                    default:
                        break;
                    }
            }

            const query = Query.create().like("name", search);

            if (setString.length > 0)
                query.like("set", setString);

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
            updateSearch();
    }, [appliedFilters])

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

    const pushToArray = (arr, elem) => {
        const indexToFind = arr.findIndex(arrElem =>
            (typeof elem === "string" && typeof arrElem === "string" &&
            arrElem.toLowerCase() === elem.toLowerCase()) ||
            (elem && typeof elem === "object" && arrElem && typeof arrElem === "object" &&
            "id" in arrElem && "id" in elem && arrElem.id === elem.id)
        );

        if (indexToFind < 0)
            arr.push(elem);
        return arr;
    }

    const getFilters = async (cards) => {
        if (cards.length > 0) {
            let sets = [];
            let categories = [];
            let stages = [];
            let types = [];
            const legal = ["Standard", "Expanded"];

            for (let c of cards) {
                const card = await tcgdex.card.get(c.id);

                sets = pushToArray(sets, {
                    id: card.set.id,
                    name: card.set.name
                })

                categories = pushToArray(categories, card.category);

                if (card.stage)
                    stages = pushToArray(stages, card.stage);

                if (card.types){
                    for (let type of card.types) {
                        types = pushToArray(types, type);
                    }
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
                    field_name: "Legal",
                    field_options: legal
                },
            ]
        }
        return [];
    }
    
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
                <>
                <div className="relative w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-12 lg:p-4 gap-12 lg:gap-4">
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
            </>
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