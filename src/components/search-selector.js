"use client";
import { useEffect, useRef, useState } from "react";

export default function SearchSelector({color}) {
    
    const OPTIONS = ["Cards", "Decks"];
const COLORS = require("/public/assets/files/colors.json");

    const colorToPick = COLORS[color] || COLORS["red"];

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showOptions, setShowOptions] = useState(false);

    const selectorRef = useRef(null);

    useEffect(() => {
        const selectText = document.getElementById("selection-text");
        const select = document.getElementById("selection");
        const options = document.getElementById("options");

        selectText.style.width = options.getBoundingClientRect().width + "px";
        options.style.width = select.getBoundingClientRect().width + "px";
        select.style.visibility = "visible";
    }, [])
    
    return (
        <div id="selection" ref={selectorRef} className={"flex justify-between items-center h-full relative text-my-white px-2 cursor-pointer " + 
        `${colorToPick.color} ${showOptions ? "rounded-t-xs": "rounded-xs"}`}
        onClick={() => setShowOptions(!showOptions)}
        onBlur={() => setShowOptions(false)} 
        tabIndex={0}
        style={{visibility: "hidden"}}>
            <p id="selection-text" className="truncate">{OPTIONS[selectedIndex]}</p>
            <div id="arrow" className= 
            {`border-l-transparent border-r-transparent border-l-6 border-r-6 ${showOptions ? "border-b-6" : "border-t-6"}`} />
            <div id="options" className={`${showOptions ? "rounded-b-sm" : "invisible"} w-max absolute z-99 top-full left-0 ${colorToPick.color} text-my-white cursor-default`}>
                {OPTIONS.map((element, index) => {
                    return (
                        <p className={`px-2 py-1 ${selectedIndex === index && colorToPick.hover} ${colorToPick.hover}
                        ${index === OPTIONS.length-1 && "rounded-b-sm"}`} key={element} onClick={(e) => setSelectedIndex(index)}>{element}</p>
                    )
                })}
            </div>
        </div>
    )
}