"use client";
import { useState } from "react";

export default function SearchSelector({options, target, setTarget}) {

    const [showOptions, setShowOptions] = useState(false);

    return (
        <div id="selection" className={`w-32 hidden sm:flex justify-between items-center h-full relative px-2 cursor-pointer text-my-white bg-highlight ` + 
            `rounded-tl-sm rounded-bl-sm ${showOptions ? "rounded-t-xs": "rounded-xs"}`}
        onClick={() => setShowOptions(!showOptions)}
        onBlur={() => setShowOptions(false)} 
        tabIndex={0}>
            <p id="selection-text" className="capitalize">{target}</p>
            <div id="arrow" className= 
            {`border-l-transparent border-r-transparent border-l-6 border-r-6 ${showOptions ? "border-b-6" : "border-t-6"}`} />
            <div id="options" className={`${!showOptions && "invisible"} w-full absolute z-99 top-full left-0 bg-highlight text-my-white cursor-default ring-1`}>
                {options.map((element, index) => {
                    return (
                        <p className={`capitalize px-2 py-1 text-foregorund ${element === target && "hover:bg-highlight-hover"} hover:bg-highlight-hover`}
                        key={element} onClick={(e) => setTarget(element.toLowerCase())}>{element}</p>
                    )
                })}
            </div>
        </div>
    )
}