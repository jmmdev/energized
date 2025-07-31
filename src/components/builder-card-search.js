"use client";
import { useContext, useEffect, useState } from "react";
import CardSearchList from "./card-search-list";
import Button from "./button";
import { FaSearch } from "react-icons/fa";
import { SearchProvider, useSearch } from "@/context/search-context";

export default function BuilderCardSearch() {

    const MySearch = () => {
        const { search, setSearch } = useSearch();
        const [text, setText] = useState(sessionStorage.getItem("card-search") || "");

        return (
            <form className="w-full flex gap-2" onSubmit={(event) => {
                event.preventDefault();
                if (text.length >= 3)
                    setSearch(text);
                }}>
                <input className={`w-full h-8 bg-background text-foreground border border-background ${text.length > 0 && "capitalize"}`} 
                placeholder="Search cards..." value={text} onChange={(e) => setText(e.target.value)} />
                <Button content={<FaSearch />} color="blue" disabled={text.length < 3}/>
            </form>
        )
    }

    return (
        <section className="flex w-full lg:w-96 h-1/2 lg:h-full flex-col transition-all">
            <SearchProvider>
                <div className="flex flex-col lg:min-h-full p-4 pb-0 lg:pb-4 bg-background-1 overflow-y-hidden">
                    <MySearch />
                    <div className="w-full h-[1px] bg-foreground opacity-40 mt-4" />
                    <CardSearchList />
                </div>
                <div className="flex lg:hidden bg-red-500 self-center px-4 py-1">
                    XD
                </div>
            </SearchProvider>
        </section>
    )
}