"use client";
import { useState } from "react";

export default function SearchSelector({options, target, setTarget}) {

    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className="relative">
            <div id="selection"
            className={`w-32 hidden sm:flex justify-between items-center h-full px-2 cursor-pointer text-my-white bg-highlight hover:bg-highlight-hover rounded-tl-sm ` + 
                `${showOptions ? "" : "rounded-bl-sm"}`}
            onClick={() => setShowOptions(!showOptions)} 
            tabIndex={0}>
                <p id="selection-text" className="capitalize">{target}</p>
                <div id="arrow" className= 
                {`border-l-transparent border-r-transparent border-l-6 border-r-6 ${showOptions ? "border-b-6" : "border-t-6"}`} />
            </div>
            <div id="options" className={`${!showOptions && "invisible"} w-full absolute z-99 top-full left-0 bg-highlight text-my-white cursor-default border-t border-[#fff8]`}>
                {options.map((element, index) => {
                    return (
                        <p className={`capitalize px-2 py-1 text-foregorund ${element === target && "hover:bg-highlight-hover"} hover:bg-highlight-hover`}
                        key={element} onClick={(e) => {
                            setTarget(element.toLowerCase());
                            setShowOptions(false);
                        }}>{element}</p>
                    )
                })}
            </div>
        </div>
    )
}