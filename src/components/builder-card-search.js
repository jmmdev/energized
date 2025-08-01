"use client";
import { useState } from "react";
import CardSearchList from "./card-search-list";
import Button from "./button";
import { FaCaretDown, FaCaretUp, FaSearch } from "react-icons/fa";
import { SearchProvider, useSearch } from "@/context/search-context";

export default function BuilderCardSearch() {
    const [showSearch, setShowSearch] = useState(true);

    const MySearch = () => {
        const { search, setSearch } = useSearch();
        const [text, setText] = useState(sessionStorage.getItem("card-search") || "");

        return (
            <form className="w-full flex gap-2" onSubmit={(event) => {
                event.preventDefault();
                if (text.length >= 3)
                    setSearch(text);
                }}>
                <input className="w-full h-8 bg-background text-foreground border border-background" 
                placeholder="Search cards..." value={text} onChange={(e) => setText(e.target.value)} />
                <Button content={<FaSearch />} color="blue" disabled={text.length < 3}/>
            </form>
        )
    }

    return (
        <section className={`flex w-full lg:w-96 ${showSearch && "h-1/2"} lg:h-full flex-col transition-transform`}>
            <SearchProvider>
                <div className={`flex flex-col ${showSearch ? "h-full p-4" : "h-0"} lg:pb-4 bg-background-1 overflow-y-hidden transition-transform`}>
                    <MySearch />
                    <div className="w-full h-[1px] bg-foreground opacity-40 mt-4" />
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
        </section>
    )
}