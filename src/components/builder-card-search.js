"use client";
import { useRef, useState } from "react";
import CardSearchList from "./card-search-list";
import Button from "./button";
import CardSearchFilters from "./card-search-filters";
import { FaCaretDown, FaPlus, FaSearch } from "react-icons/fa";
import { SearchProvider, useSearch } from "@/context/search-context";
import { useDeckContext } from "@/context/deck-context";

export default function BuilderCardSearch() {
     const {
        waiting
    } = useDeckContext();

    const [showSearch, setShowSearch] = useState(false);
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
                <Button content={<FaSearch />} color="blue" style="h-8 text-my-white px-2 rounded-tr rounded-br" disabled={search.length <= 0 && text.trim().length < 3 || isSearching}/>
            </form>
        )
    }

    return (
        <section className={`absolute top-0 lg:relative w-full lg:w-96 ${showSearch ? "h-full" : "h-0"} lg:h-full transition-all z-100`}>
            <div className="flex flex-col h-full">
                <SearchProvider>
                    <div className={`flex flex-col h-full bg-background-2 overflow-y-auto transition-transform`}>
                        <div className="lg:hidden w-full flex justify-end items-center p-4 pb-0">
                            <button className="cursor-pointer opacity-60 hover:opacity-100" onClick={() => setShowSearch(false)}>
                                <FaPlus className="text-2xl rotate-45" />
                            </button>
                        </div>
                        <MySearch />
                        <div ref={cardScrollRef} className="flex flex-col flex-1 max-h-full overflow-hidden">
                            <CardSearchFilters />
                            <CardSearchList cardScrollRef={cardScrollRef} />
                        </div>
                    </div>
                    {!showSearch &&
                    <div className="group flex lg:hidden bg-background-2 rounded-br-lg rounded-bl-lg justify-center self-center px-4 py-2 cursor-pointer"
                    onClick={() => setShowSearch(true)}>
                        <div className="flex gap-1 opacity-70 group-hover:opacity-100">
                            <FaSearch className="text-lg" />
                            <FaCaretDown />
                        </div>
                    </div>
                    }
                </SearchProvider>
            </div>
            {waiting && <div className="absolute top-0 left-0 h-full w-full bg-[#0008] z-20" />}
        </section>
    )
}