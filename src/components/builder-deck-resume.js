import { useDeckContext } from "@/context/deck-context";
import { useEffect, useState } from "react";

export default function BuilderDeckResume() {
    const {
        name, setName, cardQuantity, legal, setHasChanges
    } = useDeckContext();

    const [text, setText] = useState(name);
    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {
        setFirstLoad(false);
    }, [])

    useEffect(() => {
            const handler = setTimeout(() => {
                if (text.length <= 0)
                    setHasChanges(false);
                else {
                    setName(text);
                    if (!firstLoad)
                        setHasChanges(true);
                }
            }, 300);
    
            return () => {
                clearTimeout(handler);
            };
        }, [text]);

    return (
        <div>
            <input className="w-full max-w-sm text-2xl bg-background-2 text-foreground rounded border border-transparent font-semibold hover:border-foreground" 
            value={text} onChange={(e) => setText(e.target.value)}/>
            <div className="flex flex-col xs:flex-row gap-2 font-semibold uppercase mt-2">
                <p>
                Standard: <span className={`${cardQuantity === 60 ? legal.standard ? "text-emerald-500" : "text-red-500" : "text-neutral-500"}`}>
                            {cardQuantity === 60 ? legal.standard ? "Legal" : "Illegal" : "N/A"}
                        </span>
                </p>
                <p>
                Expanded: <span className={`${cardQuantity === 60 ? legal.expanded ? "text-emerald-500" : "text-red-500" : "text-neutral-500"}`}>
                            {cardQuantity === 60 ? legal.expanded ? "Legal" : "Illegal" : "N/A"}
                        </span>
                </p>
            </div>
        </div>
    )
}