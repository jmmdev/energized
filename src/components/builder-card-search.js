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
        const { search, setSearch } = useSearch();
        const [text, setText] = useState(search.length > 0 ? search : "");

        const doSetText = (e) => {
            setText(e.target.value);
        }

        return (
            <form className="w-full flex p-4" onSubmit={(event) => {
                event.preventDefault();
                if (text.length >= 3)
                    setSearch(text);
                }}>
                <input className="h-8 w-full bg-my-white text-my-black border-background outline-none" 
                placeholder="Search cards..." value={text} onChange={doSetText} />
                <Button content={<FaSearch />} color="blue" style="h-8 text-my-white px-2 rounded-tr rounded-br" disabled={search.length <= 0 && text.length < 3}/>
            </form>
        )
    }

    const GetAppliedFilterPills = () => {
        const { appliedFilters, setAppliedFilters } = useSearch();
        const output = [];

        const removeFilter = (field, value) => {
            const newAppliedFilters = [...appliedFilters];

            const elemIndex = newAppliedFilters.findIndex(elem => elem.field === field && elem.value === value);
            
            if (elemIndex >= 0) {
                newAppliedFilters.splice(elemIndex, 1);
                setAppliedFilters(newAppliedFilters);
            }
        }

        for (const ap of appliedFilters) {
            output.push(
                <div key={ap.field + ap.value} className="group bg-background-2 px-2 py-1 text-sm rounded-full cursor-pointer" onClick={() => removeFilter(ap.field, ap.value)}>
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100">
                        <p>{ap.field}: {ap.value}</p>
                        <FaPlus className="rotate-45" />
                    </div>
                </div>
            )
        }

        return (
            <div className={`w-full flex flex-wrap px-4 gap-2 ${output.length > 0 ? "mb-2" : ""}`}>
                {output}
            </div>
        )
    }

    return (
        <section className={`absolute top-0 lg:relative w-full lg:w-96 ${showSearch ? "h-full" : "h-0"} lg:h-full transition-all`}>
            <div className="flex flex-col h-full">
                <SearchProvider>
                    <div className={`flex flex-col h-full bg-background-1 overflow-y-auto transition-transform`}>
                        <div className="lg:hidden w-full flex justify-end items-center p-4 pb-0">
                            <button className="cursor-pointer opacity-60 hover:opacity-100" onClick={() => setShowSearch(false)}>
                                <FaPlus className="text-2xl rotate-45" />
                            </button>
                        </div>
                        <MySearch />
                        <GetAppliedFilterPills />
                        <div ref={cardScrollRef} className="flex flex-col flex-1">
                            <CardSearchFilters />
                            <CardSearchList cardScrollRef={cardScrollRef} />
                        </div>
                    </div>
                    {!showSearch &&
                    <div className="group flex lg:hidden bg-background-1 rounded-br-lg rounded-bl-lg justify-center self-center px-4 py-2 cursor-pointer"
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