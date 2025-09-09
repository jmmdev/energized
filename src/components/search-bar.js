"use client";
import { useEffect, useState } from "react";
import SearchSelector from "@/components/search-selector";
import Button from "@/components/button";
import {FaSearch} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SearchBar() {
    const router = useRouter();

    const OPTIONS = ["decks", "cards"];

    const [target, setTarget] = useState("decks");
    const [searchText, setSearchText] = useState("");

    const handleChange = (e) => {
        const content = e.target.value;
        setSearchText(content);
    }

    return (
        <div className="w-full flex justify-center color-background p-2">
            <form onSubmit={(e) => {
                e.preventDefault();
                if (searchText.length > 0)
                    router.push(`/search/${target}?name=${searchText}`);
            }} className="w-full max-w-[1200px] flex justify-center rounded-sm">
                <SearchSelector options={OPTIONS} target={target} setTarget={setTarget} />
                <input placeholder="Search..." name="search-text" value={searchText} onChange={handleChange} className="w-full h-8 bg-my-white text-my-black outline-none" />
                <Button color="blue" style="px-2 rounded-tr-sm rounded-br-sm text-lg text-my-white" content={<FaSearch />} />
            </form>
        </div>
    )
}