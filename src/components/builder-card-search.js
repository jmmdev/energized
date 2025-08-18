"use client";
import { useState } from "react";
import CardSearchList from "./card-search-list";
import Button from "./button";
import { FaCaretDown, FaPlus, FaSearch } from "react-icons/fa";
import { SearchProvider, useSearch } from "@/context/search-context";
import { useDeckContext } from "@/context/deck-context";

export default function BuilderCardSearch({showSearch, setShowSearch}) {
     const {
        waiting
    } = useDeckContext();

    const MySearch = () => {
        const { setSearch, setFilters } = useSearch();
        const [text, setText] = useState("");

        const doSetText = (e) => {
            setFilters([]);
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
                <Button content={<FaSearch />} color="blue" style="h-8 text-my-white px-2 rounded-tr rounded-br" disabled={text.length < 3}/>
            </form>
        )
    }

    return (
        <section className={`absolute top-0 lg:relative w-full lg:w-96 ${showSearch ? "h-full" : "h-0"} lg:h-full transition-all`}>
            <div className="flex flex-col h-full">
                <SearchProvider>
                    <div className={`flex flex-col h-full bg-background-1 overflow-y-auto transition-transform`}>
                        <div className="lg:hidden w-full flex justify-end items-center">
                            <button className="cursor-pointer opacity-60 hover:opacity-100 p-2" onClick={() => setShowSearch(false)}>
                                <FaPlus className="text-2xl rotate-45" />
                            </button>
                        </div>
                        <MySearch />
                        <CardSearchList />
                    </div>
                    {!showSearch &&
                    <div className="group flex lg:hidden bg-background-1 rounded-br-lg rounded-bl-lg justify-center self-center px-3 py-1.5 cursor-pointer"
                    onClick={() => setShowSearch(true)}>
                        <div className="flex gap-1 opacity-70 group-hover:opacity-100">
                            <FaSearch />
                            <FaCaretDown className="text-sm" />
                        </div>
                    </div>
                    }
                </SearchProvider>
            </div>
            {waiting && <div className="absolute top-0 left-0 h-full w-full bg-[#0008] z-20" />}
        </section>
    )
}