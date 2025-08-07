import { useDeckContext } from "@/context/deck-context";
import { useEffect, useState } from "react";

export default function BuilderDeckResume() {
    const {
        name, setName, legal, cardQuantity, setHasChanges

    } = useDeckContext();

    const [text, setText] = useState(name);
    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {
        setFirstLoad(false);
    }, [])

    useEffect(() => {
            const handler = setTimeout(() => {
                setName(text);
                if (!firstLoad)
                    setHasChanges(true);
            }, 300);
    
            return () => {
                clearTimeout(handler);
            };
        }, [text]);

    return (
        <div>
            <input className="w-full max-w-sm text-2xl bg-transparent text-foreground rounded border border-background hover:border-neutral-500" 
            value={text} onChange={(e) => setText(e.target.value)}/>
            <p className="px-1.5">
                Standard: {cardQuantity !== 60 ? "N/A" : <span className={legal.standard ? "text-emerald-400" : "text-red-400"}>{legal.standard ? "Legal" : "Illegal"}</span>}
                {", "}
                Expanded: {cardQuantity !== 60 ? "N/A" : <span className={legal.expanded ? "text-emerald-400" : "text-red-400"}>{legal.expanded ? "Legal" : "Illegal"}</span>}
            </p>
        </div>
    )
}