"use client";
import { useEffect, useState } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

export default function BuilderCardSearch() {
    
    const [search, setSearch] = useState("");
    const [showCardSearch, setShowCardSearch] = useState(true);

    const handleChange = (event) => {
        const toSearch = event.target.value;

        // Card Search

        setSearch(toSearch);
    }

    return (
        <section className="flex overflow-y-hidden h-full bg-background-2">
            <div id="builder-card-search" className={`"w-0" ${showCardSearch && "flex"} p-2 min-h-full flex-col bg-background-2 transition-transform`}>
                <input className="w-full bg-background text-foreground" placeholder="Search cards..." value={search} onChange={handleChange} />    
            </div>
            <div className="relative h-full flex justify-center items-center px-2 py-3 cursor-pointer text-my-white opacity-50 hover:opacity-100" 
            onClick={() => setShowCardSearch(!showCardSearch)}>                    
                <p className="w-max absolute top-0 text-sm text-my-white -rotate-90" style={{transform: "translateX(-50%)"}}>
                    {showCardSearch ? "Hide" : "Show"} Card Search
                </p>
                <div className="text-2xl">
                    {showCardSearch ? <FaCaretLeft/> : <FaCaretRight />}
                </div>
                <div />
            </div>
        </section>
    )
}