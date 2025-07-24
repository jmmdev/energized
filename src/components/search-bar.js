"use client";
import { useEffect, useState } from "react";
import SearchSelector from "@/components/search-selector";
import Button from "@/components/button";
import {FaSearch} from "react-icons/fa";

export default function SearchBar() {
    const [searchText, setSearchText] = useState("");
    const [color, setColor] = useState("");

    const handleChange = (e) => {
        const content = e.target.value;
        setSearchText(content);
    }
    
    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newColorScheme = event.matches ? "yellow" : "red";
            setColor(newColorScheme);

        });

        let colorScheme;
        if (window.matchMedia) {
            colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "yellow" : "red";
        }

        setColor(colorScheme);
    }, [])

    return (
        <div className="w-full flex justify-center color-background p-2 bg-container">
            <div className="w-full max-w-[1200px] flex justify-center rounded-sm gap-1">
                <SearchSelector color={color} />
                <input name="search-text" value={searchText} onChange={handleChange} className="w-full h-8 border border-container" />
                <Button content={<FaSearch />} color={color} />
            </div>
        </div>
    )
}