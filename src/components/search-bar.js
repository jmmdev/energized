"use client";
import { useState } from "react";
import SearchSelector from "@/components/search-selector";
import Button from "@/components/button";
import {FaSearch} from "react-icons/fa";

export default function SearchBar() {
    const [searchText, setSearchText] = useState("");

    const handleChange = (e) => {
        const content = e.target.value;
        setSearchText(content);
    }

    return (
        <div className="w-full flex justify-center color-background p-2 bg-container">
            <div className="w-full max-w-[1200px] flex justify-center rounded-sm gap-2">
                <SearchSelector color="gray"/>
                <input name="search-text" value={searchText} onChange={handleChange} className="w-full h-8" />
                <Button content={<FaSearch />} color={"gray"} />
            </div>
        </div>
    )
}