"use client";
import { useEffect, useRef, useState } from "react";

export default function SearchSelector({options, target, setTarget}) {

    const [showOptions, setShowOptions] = useState(false);

    const selectorRef = useRef();

    useEffect(() => {
        const onMouseUp = () => {
            if (selectorRef.current !== document.activeElement)
                setShowOptions(false);
        }

        window.addEventListener("mouseup", onMouseUp);

        return () => {
            window.removeEventListener("mouseup", onMouseUp);
        }
    }, [])

    return (
        <div className="relative">
            <button ref={selectorRef} id="selection"
            className={`flex gap-4 sm:gap-8 justify-between items-center h-full px-2 cursor-pointer text-my-white bg-highlight hover:bg-highlight-hover rounded-tl-sm ` + 
                `${showOptions ? "" : "rounded-bl-sm"}`}
            onClick={() => setShowOptions(!showOptions)}>
                <p id="selection-text" className="capitalize">{target}</p>
                <div id="arrow" className= 
                {`border-l-transparent border-r-transparent border-l-6 border-r-6 ${showOptions ? "border-b-6" : "border-t-6"}`} />
            </button>
            <div id="options" className={`${!showOptions ? "invisible" : ""} w-full flex flex-col absolute z-99 top-full left-0 bg-highlight text-my-white cursor-default`}>
                {options.map(element => {
                    return (
                        <button className={`text-start capitalize px-2 py-1 text-foregorund ${element === target ? "hover:bg-highlight-hover" : ""} hover:bg-highlight-hover`}
                        key={element} onClick={(e) => {
                            setTarget(element.toLowerCase());
                            setShowOptions(false);
                        }}>{element}</button>
                    )
                })}
            </div>
        </div>
    )
}