"use client";
import { useState } from "react";
import CardSearchList from "./card-search-list";
import Button from "./button";
import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
import { SearchProvider, useSearch } from "@/context/search-context";
import { useDeckContext } from "@/context/deck-context";

export default function BuilderCardSearch({showSearch, setShowSearch}) {
     const {
        waiting
    } = useDeckContext();


    const MySearch = () => {
        const { setSearch } = useSearch();
        const [text, setText] = useState(sessionStorage.getItem("card-search") || "");

        return (
            <form className="w-full flex gap-2 p-4 bg-background-2" onSubmit={(event) => {
                event.preventDefault();
                if (text.length >= 3)
                    setSearch(text);
                }}>
                <input className="w-full h-8 bg-background text-foreground border border-background" 
                placeholder="Search cards..." value={text} onChange={(e) => setText(e.target.value)} />
                <Button content={<FaSearch />} color="blue" style="text-my-white px-2 rounded" disabled={text.length < 3}/>
            </form>
        )
    }

    return (
        <section className={`relative w-full lg:w-96 ${showSearch ? "h-full" : "h-auto"} lg:h-full`}>
            <div className="flex flex-col h-full">
                <SearchProvider>
                    <div className={`flex flex-col ${showSearch ? "h-full" : "h-0"} lg:h-full bg-background overflow-y-hidden transition-transform`}>
                        <MySearch />
                        <CardSearchList />
                    </div>
                    <div className="group flex lg:hidden bg-background-1 rounded-br-lg rounded-bl-lg justify-center self-center px-3 py-1.5 mb-4 cursor-pointer"
                    onClick={() => setShowSearch(!showSearch)}>
                        <div className="flex gap-1 opacity-70 group-hover:opacity-100">
                            <FaSearch />
                            {showSearch ? <FaCaretUp className="text-sm" /> : <FaCaretDown className="text-sm" />}
                        </div>
                    </div>
                </SearchProvider>
            </div>
            {waiting && <div className="absolute top-0 left-0 h-full w-full bg-[#0008] z-20" />}
        </section>
    )
}