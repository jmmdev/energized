"use client";
import { useRef, useState } from "react";
import CardSearchList from "./card-search-list";
import Button from "./button";
import CardSearchFilters from "./card-search-filters";
import { FaSearch } from "react-icons/fa";
import { SearchProvider, useSearch } from "@/context/search-context";

export default function BuilderCardSearch({waiting}) {

    const cardScrollRef = useRef();

    const MySearch = () => {
        const { search, setSearch, setTrigger, isSearching } = useSearch();
        const [text, setText] = useState(search.length > 0 ? search : "");

        const doSetText = (e) => {
            setText(e.target.value);
        }

        return (
            <form className="w-full flex p-4" onSubmit={(event) => {
                event.preventDefault();
                if (text.trim().length >= 3) {
                    setSearch(text);
                    setTrigger((t) => t+1)
                }
                }}>
                <input className={`h-8 w-full bg-my-white border-background outline-none ${isSearching ? "text-neutral-400" : "text-my-black"}`} 
                placeholder="Search cards..." value={text} onChange={doSetText} disabled={isSearching} />
                <Button color="blue" className="h-8 text-my-white px-2 rounded-tr rounded-br" disabled={search.length <= 0 && text.trim().length < 3 || isSearching}>
                    <FaSearch />
                </Button>
            </form>
        )
    }

    return (
        <section className={`w-full h-full`}>
            <div className="flex flex-col h-full">
                <SearchProvider>
                    <div className={`flex flex-col h-full overflow-y-hidden`}>
                        <MySearch />
                        <div ref={cardScrollRef} className="flex flex-col flex-1 max-h-full gap-4 overflow-hidden">
                            <CardSearchFilters />
                            <CardSearchList cardScrollRef={cardScrollRef} />
                        </div>
                    </div>
                </SearchProvider>
            </div>
            {waiting && <div className="absolute top-0 left-0 h-full w-full bg-[#0008] z-20" />}
        </section>
    )
}