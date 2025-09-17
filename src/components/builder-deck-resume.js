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
            <div className="flex gap-2 font-medium mt-2">
                <p>
                Standard: <span className={`text-my-white px-2 py-0.5 rounded-sm ${cardQuantity === 60 ? legal.standard ? "bg-emerald-500" : "bg-red-500" : "bg-neutral-500"}`}>
                            {cardQuantity === 60 ? legal.standard ? "Legal" : "Illegal" : "N/A"}
                        </span>
                </p>
                <p>
                Expanded: <span className={`text-my-white px-2 py-0.5 rounded-sm ${cardQuantity === 60 ? legal.expanded ? "bg-emerald-500" : "bg-red-500" : "bg-neutral-500"}`}>
                            {cardQuantity === 60 ? legal.expanded ? "Legal" : "Illegal" : "N/A"}
                        </span>
                </p>
            </div>
        </div>
    )
}