"use client";
import { useEffect, useRef, useState } from "react";

export default function SearchSelector() {
    
    const OPTIONS = ["Cards", "Decks"];

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showOptions, setShowOptions] = useState(false);

    const selectorRef = useRef(null);
    
    return (
        <div id="selection" ref={selectorRef} className={`w-32 hidden sm:flex justify-between items-center h-full relative px-2 cursor-pointer text-my-white bg-highlight ` + 
            `rounded-tl-sm rounded-bl-sm ${showOptions ? "rounded-t-xs": "rounded-xs"}`}
        onClick={() => setShowOptions(!showOptions)}
        onBlur={() => setShowOptions(false)} 
        tabIndex={0}>
            <p id="selection-text">{OPTIONS[selectedIndex]}</p>
            <div id="arrow" className= 
            {`border-l-transparent border-r-transparent border-l-6 border-r-6 ${showOptions ? "border-b-6" : "border-t-6"}`} />
            <div id="options" className={`${!showOptions && "invisible"} w-full absolute z-99 top-full left-0 bg-highlight text-my-white cursor-default ring-1`}>
                {OPTIONS.map((element, index) => {
                    return (
                        <p className={`px-2 py-1 text-foregorund ${selectedIndex === index && "hover:bg-highlight-hover"} hover:bg-highlight-hover`}
                        key={element} onClick={(e) => setSelectedIndex(index)}>{element}</p>
                    )
                })}
            </div>
        </div>
    )
}