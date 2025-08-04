import { useDeckContext } from "@/context/deck-context";

export default function BuilderDeckResume() {
    const {
        name, setName, legal, cardQuantity,

    } = useDeckContext();

    return (
        <div>
            <input className="w-full max-w-sm text-2xl bg-transparent text-foreground rounded border border-background hover:border-neutral-500" 
            value={name} onChange={(e) => setName(e.target.value)}/>
            <p className="px-1.5">
                Standard: {cardQuantity !== 60 ? "N/A" : <span className={legal.standard ? "text-emerald-400" : "text-red-400"}>{legal.standard ? "Legal" : "Illegal"}</span>}
                {", "}
                Expanded: {cardQuantity !== 60 ? "N/A" : <span className={legal.expanded ? "text-emerald-400" : "text-red-400"}>{legal.expanded ? "Legal" : "Illegal"}</span>}
            </p>
        </div>
    )
}