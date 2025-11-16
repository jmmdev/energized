"use client";
import { useState } from "react";
import SearchSelector from "@/components/search-selector";
import Button from "@/components/button";
import {FaSearch} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function SearchBar() {
    const router = useRouter();
    const pathname = usePathname();

    const OPTIONS = ["decks", "cards", "users"];

    const [target, setTarget] = useState(pathname.includes("/search") ? pathname.replace("/search/", "") : "decks");
    const [searchText, setSearchText] = useState("");

    return (
        <div className="w-full flex justify-center color-background p-2">
            <SearchSelector options={OPTIONS} target={target} setTarget={setTarget} />
            <form onSubmit={(e) => {
            e.preventDefault();
            
            const content = searchText.trim();

            if (content.length > 0)
                router.push(`/search/${target}?name=${content}`);
            
        }} className="w-full max-w-[1200px] flex justify-center rounded-sm">
                <input placeholder="Search..." name="search-text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full h-8 bg-my-white text-my-black outline-none" />
                <Button color="blue" className="px-2 rounded-tr-sm rounded-br-sm text-lg text-my-white">
                    <FaSearch />
                </Button>
            </form>
        </div>
    )
}